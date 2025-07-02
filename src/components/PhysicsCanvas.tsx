import React, { useEffect, useRef, useState } from 'react';
import Matter, { Engine } from 'matter-js';
import { Eraser, Pen, Pin, ChevronLeft, ChevronRight, RefreshCw, Hand, Circle, Link } from 'lucide-react';
import axios from 'axios';
import { useSocket } from '../context/SocketContext';
import { levelFactories } from './levels';
// import Timer from './Timer';

interface LogInfo {
  player_number: number,
  type: 'draw' | 'erase' | 'push' | 'refresh' | 'move_prev_level' | 'move_next_level',
  timestamp: Date,
}

declare module 'matter-js' {
  interface Body {
    eraserEmitted?: boolean;
  }
}

const TOTAL_LEVELS = 20; // 총 스테이지 수를 정의합니다.

// 맵이 변할 때 마다 실행됨.
const PhysicsCanvas: React.FC = () => {
  const socket = useSocket();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef(Matter.Engine.create({
    gravity: { x: 0, y: 1, scale: 0.001 },
  }));
  const renderRef = useRef<Matter.Render | null>();
  const runnerRef = useRef<Matter.Runner | null>(null);
  const [tool, setTool] = useState<'pen' | 'eraser' | 'pin' | 'chain' | 'push'>('pen');
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawPoints, setDrawPoints] = useState<Matter.Vector[]>([]);
  const [currentLevel, setCurrentLevel] = useState(1);
  const currentLevelRef = useRef<number>(1);
  const [resetTrigger, setResetTrigger] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [currentTurn, setCurrentTurn] = useState<string>('player1');
  const [pushLock, setPushLock] = useState(false);
  const [drawLock, setDrawLock] = useState(false);
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  // chain 이벤트가 이미 emit 되었는지 여부 플래그 (중복 방지)
  const chainEmittedRef = useRef<boolean>(false);
  
  // const [cursors, setCursors] = useState<{ playerId: string; x: number; y: number }[]>([]);
  // const [cursors, setCursors] = useState<{ playerId: string; x: number; y: number }[]>([]);
  const [cursors, setCursors] = useState<{ playerId: string; x: number; y: number; timestamp: number }[]>([]);
  const CURSOR_LIFETIME = 2000; // 2초
  
  const initialBallPositionRef = useRef({ x: 0, y: 0 }); // 공 초기 위치 저장
  const mapObjects = ['ground', 'tower1', 'tower2', 'tower3', 'tower4', 'tower5', 'base', 'pedestal', 'top_bar', 'vertical_bar', 'red_box', 'left_up_green_platform', 'left_down_green_platform', 'right_up_green_platform', 'right_down_green_platform', 'left_red_wall', 'right_red_wall', 'bottom_red_wall', 'red_platform', 'green_ramp', 'central_obstacle', 'wall_bottom', 'wall_top', 'wall_left', 'wall_right', 'horizontal_platform', 'frame_top', 'frame_left', 'frame_right', 'horizontal_down_platform', 'pillar1', 'pillar2', 'pillar3', 'rounded_slope', 'horizontal_down_platform', 'horizontal_up_platform', 'nail4_0', 'nail4_1', 'nail4_2', 'nail8_0', 'horizontalPlatformForBall', 'horizontalPlatform', 'slope', 'horizontalPlatformForStar', 'cloud', 'scoop', 'obstacle', 'floor', 'Ishape', 'upperrectangle', 't_shape', 'nail7_0', 'nail7_1'];
  const staticObjects = ['wall', 'ball', 'balloon','nail'].concat(mapObjects);
  const ballRef = useRef<Matter.Body | null>(null);
  const cursorCanvasRef = useRef<HTMLCanvasElement | null>(null);
  // const [startTimer, setStartTimer] = useState<boolean>(false);
  // const [isFinished, setIsFinished] = useState<boolean>(false);

  // A list to store the selected pins
  const [selectedPins, setSelectedPins] = useState<Matter.Body[]>([]);

  // 못(nail)들을 저장하는 상태
  const [nails, setNails] = useState<Matter.Body[]>([]);
  const nailsRef = useRef<Matter.Body[]>([]);

  // nail 추가 함수
  // const addNail = (nail: Matter.Body) => {
  //   nailsRef.current = [...nailsRef.current, nail];
  //   setNails(nailsRef.current); // 상태 업데이트도 유지
  // };
  const addNail = (nail: Matter.Body) => {
    // 이미 같은 label이 존재하는지 확인
    const exists = nailsRef.current.some(existingNail => existingNail.label === nail.label);
    
    if (!exists) {
      nailsRef.current = [...nailsRef.current, nail];
      setNails(nailsRef.current); // 상태 업데이트도 유지
    }
  };

  // nails에서 특정 nail 삭제 함수
  const removeNail = (nail: Matter.Body) => {
    nailsRef.current = nailsRef.current.filter((n) => n !== nail); // 참조값 업데이트
    setNails(nailsRef.current); // 상태 업데이트
  };

  // nails 상태 초기화 함수
  const resetNails = () => {
    nailsRef.current = []; // 참조값 초기화
    setNails([]); // 상태도 초기화
  };
  
  useEffect(() => {
    if(gameEnded) {
      socket.emit('completeLevel', {
        completedLevel: currentLevel,
        playerId: 'player2',
      });
    }
  }, [gameEnded])

  // -----------------------------------------------
  // 2) 서버에서 "completedLevelsResponse" 받기
  //    => completedLevels 업데이트
  // -----------------------------------------------
  useEffect(() => {
    // 'completedLevelsResponse' => 서버가 getCompletedLevels 요청에 대한 응답을 준다
    socket.on('completedLevelsResponse', (data: { levels: number[] }) => {
      console.log('Received completed levels:', data.levels);
      setCompletedLevels(data.levels);
    });

    // 'completedLevelsUpdated' => 누군가 completeLevel 하면,
    // 서버가 전체 클라이언트에 브로드캐스트할 수도 있음
    socket.on('completedLevelsUpdated', (data: { levels: number[] }) => {
      console.log('completedLevelsUpdated:', data.levels);
      setCompletedLevels(data.levels);
    });

    // 컴포넌트 마운트 시점에 "getCompletedLevels" 이벤트로 요청
    socket.emit('getCompletedLevels');

    return () => {
      socket.off('completedLevelsResponse');
      socket.off('completedLevelsUpdated');
    };
  }, [socket]);

  useEffect(() => {
    socket.on('createChain', (data: { playerId: string, customId: string, pinAId: string, pinBId: string, stiffness: number, damping: number, length: number, currentLevel: number }) => {
      console.log('Received createChain from server:', data);
  
      // 1) pinA, pinB를 label로 찾아서 Body 객체를 얻는다
      const pinA = Matter.Composite.allBodies(engineRef.current.world)
                     .find(b => b.label === data.pinAId);
      const pinB = Matter.Composite.allBodies(engineRef.current.world)
                     .find(b => b.label === data.pinBId);
  
      if (!pinA || !pinB) {
        console.warn('Could not find pinA or pinB in local world:', data.pinAId, data.pinBId);
        return;
      }
  
      // 2) Constraint 생성
      const chain = Matter.Constraint.create({
        bodyA: pinA,
        bodyB: pinB,
        stiffness: data.stiffness,
        damping: data.damping,
        length: data.length,
        render: {
          visible: true,
          lineWidth: 4,
          strokeStyle: '#8B0000',
        },
        label: data.customId,
      });
  
      // 3) Matter.World에 추가
      Matter.World.add(engineRef.current.world, chain);
    });
  
    return () => {
      socket.off('createChain');
    };
  }, [socket]);

  useEffect(() => {
    socket.emit('getTurn'); // 현재 턴 정보 요청
  
    socket.on('updateTurn', (data: { currentTurn: string }) => {
      console.log('Current turn:', data.currentTurn);
      setCurrentTurn(data.currentTurn); // 클라이언트 상태 업데이트
    });
  
    return () => {
      socket.off('updateTurn');
    };
  }, []);

  // Socket 이벤트 처리
  useEffect(() => {
    socket.on('mouseMove', (data: { x: number; y: number; playerId: string }) => {
      if(data.playerId !== 'player1') return;
      const timestamp = Date.now();
      // console.log("data: ", data);
      setCursors((prevCursors) => {
        const now = Date.now();
        const filteredCursors = prevCursors.filter((cursor) => now - cursor.timestamp < CURSOR_LIFETIME);

      const updatedCursors = filteredCursors.filter((cursor) => cursor.playerId !== data.playerId);
      return [...updatedCursors, { ...data, timestamp }];
      
      });
    });

    return () => {
      socket.off('mouseMove');
    };
  }, []);


  useEffect(() => {
    socket.on('drawShape', (data: { points: Matter.Vector[]; playerId: string; customId: string; currentLevel: number; collisionCategory?: number; groupNumber?: number}) => {
      console.log("playerId: ", data.playerId);
  
      // 도형을 생성하며 customId를 설정
      const result = createPhysicsBody(data.points, false, data.collisionCategory ?? 0x0001, data.groupNumber ?? 0, data.customId) as { body: Matter.Body; nailsInShape: Matter.Body[] };

      if(result) {
        if (result.body) {
          // Matter.js 월드에 도형 추가
          Matter.World.add(engineRef.current.world, result.body);

          if (result.nailsInShape.length > 0) {
            const targetBody = result.body;

            if (data.currentLevel === 3) {
              console.log("sfdasdasfd")
              Matter.Body.setAngularVelocity(result.body, -0.05);
            }

            // nailsInShape와 생성된 도형을 Constraint로 연결
            if (result.nailsInShape) {
              result.nailsInShape.forEach((nail) => {
                const constraint = Matter.Constraint.create({
                  bodyA: targetBody, // 도형
                  pointA: { x: nail.position.x - result.body.position.x, y: nail.position.y - result.body.position.y }, // 도형 내 nail의 상대 위치
                  bodyB: nail, // nail
                  pointB: { x: 0, y: 0 }, // nail 중심
                  stiffness: 1, // 강성
                  length: 0, // 연결 길이
                  render: {
                    visible: false, // Constraint 시각화를 비활성화
                  },
                });
    
                // Matter.js 월드에 Constraint 추가
                Matter.Composite.add(engineRef.current.world, constraint);
              });
            }
          }
        }
      }
    })
  
    return () => {
      socket.off('drawShape');
    };
  }, []);

  useEffect(() => {
    // drawPin 이벤트 처리
    const handleDrawPin = (data: { customId: string; centerX: number; centerY: number; radius: number; category: number; groupNumber: number; playerId: string; currentLevel: number }) => {
      console.log("Received drawPin data: ", data);

      // 클릭 위치에 존재하는 사물을 찾음
      const mousePosition = { x: data.centerX, y: data.centerY };
      const bodies = Matter.Composite.allBodies(engineRef.current.world);
      const targetBody = bodies.find((body) =>
        Matter.Bounds.contains(body.bounds, mousePosition)
      );

      // 사물이 없으면 못을 생성하지 않음
      if (!targetBody) {
        console.log("No body found under the nail position.");
        return null;
      }
 
      // 못(nail) 생성
      const nail = Matter.Bodies.circle(data.centerX, data.centerY, data.radius, {
        isStatic: targetBody.isStatic ? true : false,
        collisionFilter: {
          group: data.groupNumber,
          category: data.category, // Nail의 카테고리
          // mask: 0xFFFF & ~data.category, // 같은 카테고리끼리 충돌하지 않도록 설정
          mask: 0x0000,
        },
        render: {
          // fillStyle: '#ef4444', // 못의 색상
          fillStyle: 'rgba(0, 0, 0, 0.0)', // 못의 색상
          strokeStyle: '#fbbf24',
          lineWidth: 3,
        },
        label: data.customId || `nail_${Date.now()}`, // Assign customId
        mass: 30,
      });

      // 기존 nail들의 category 값 가져오기
      const existingCategories = nailsRef.current
      .map((nail) => nail.collisionFilter.category)
      .filter((category): category is number => category !== undefined);

      // 기존 nail들의 category 값을 |로 연결
      const additionalMask = existingCategories.reduce(
        (mask, category) => mask | category,
        0x0000 // 초기값 0
      );

      // 못(nail)을 포함한 객체의 충돌 규칙 수정
      targetBody.collisionFilter = {
        group: data.groupNumber,
        category: data.category, // Nail과 같은 카테고리
        // mask: 0xFFFF,
        // mask: 0xFFFF & ~data.category | 0x0001, // 같은 카테고리끼리 충돌하지 않도록 설정
        // mask: (0xFFFF & ~data.category) | 0x0001 | additionalMask, // 기존 category 추가
        // mask: 0x0001 | additionalMask, // 기존 category 추가
        // mask: 0x0100 | 0x0001,
        mask: 0xFFFF & ~data.category, // 같은 카테고리끼리 충돌하지 않도록 설정
      }

      console.log("(0xFFFF & ~data.category) | 0x0001 | additionalMask: ", (0xFFFF & ~data.category) | 0x0001 | additionalMask)
      console.log("targetBody.collisionFilter: ", targetBody.collisionFilter)
      console.log("targetBody: ", targetBody)

      // // 물리 엔진 업데이트
      // Matter.Engine.update(engineRef.current);

      // 상태에 nail 추가
      addNail(nail);
      console.log("sdfnail: ", nail);
      console.log("sdfnails: ", nails);
      
      // Matter.js 월드에 nail 추가
      Matter.Composite.add(engineRef.current.world, nail);

      // 도형(targetBody)와 못(nail)을 Constraint로 연결
      const constraint = Matter.Constraint.create({
        bodyA: targetBody, // 도형
        pointA: {
          x: nail.position.x - targetBody.position.x,
          y: nail.position.y - targetBody.position.y,
        },
        bodyB: nail, // 못
        pointB: { x: 0, y: 0 }, // 못의 중심
        stiffness: 1, // 강성(도형과 못의 연결 강도)
        length: 0, // 길이 (0으로 설정해 못이 도형에 붙어 있게 함)
        render: {
          visible: false, // Constraint 시각화를 비활성화
        },
      });

      // Matter.js 월드에 Constraint 추가
      Matter.Composite.add(engineRef.current.world, constraint);
    };
  
    // 소켓 이벤트 리스너 등록
    socket.on('drawPin', handleDrawPin);
  
    return () => {
      // 리스너 정리
      socket.off('drawPin', handleDrawPin);
    };
  }, []);

  useEffect(() => {
    socket.on('resetLevel', (data: { level: number }) => {
      console.log(`Resetting level to: ${data.level}`);
      
      // 월드와 렌더를 정지하고 지운 후, 다시 설정
      const world = engineRef.current.world;
      Matter.World.clear(world, false);
      Matter.Engine.clear(engineRef.current);
  
      if (renderRef.current) {
        Matter.Render.stop(renderRef.current);
        Matter.Render.run(renderRef.current);
      }

      resetNails();
  
      // 수신한 레벨로 초기화
      setCurrentLevel(data.level);
      currentLevelRef.current = data.level //
      setResetTrigger((prev) => !prev);
    });
  
    return () => {
      socket.off('resetLevel');
    };
  }, []);

  useEffect(() => {
    socket.on('erase', (data: { customId: string; playerId: string }) => {
    //   const body = Matter.Composite.allBodies(engineRef.current.world).find(
    //     (b) => b.label === data.customId
    //   );
    //   if (body) {
    //     Matter.World.remove(engineRef.current.world, body);
    //   }
    // });

      // 1) 월드에 존재하는 모든 바디 조회
      const allBodies = Matter.Composite.allBodies(engineRef.current.world);
    
      // 0) customId가 "nail"로 시작하는지 아닌지 확인
      if(data.customId.startsWith("nail")) {
        // 2) label이 data.customId와 일치하는 Body 찾기
        const targetBody = allBodies.find(b => b.label === data.customId);

        if (targetBody) {
          // 3) 월드에 존재하는 모든 Constraint 조회
          const allConstraints = Matter.Composite.allConstraints(engineRef.current.world);

          // 4) targetBody와 연결된 Constraint( bodyA === targetBody || bodyB === targetBody )를 모두 찾아 제거하고 기존 targetBody들 충돌계수 수정
          const constraintsToRemove = allConstraints.filter(ct => {
            return ct.bodyA === targetBody || ct.bodyB === targetBody;
          });
          console.log("constraintsToRemove.length: ", constraintsToRemove.length)
          // 
          if(constraintsToRemove.length === 0) {
            console.log("constraintsToRemove.length: ", constraintsToRemove.length)
            socket.emit('releaseCategory', {
              playerId: 'player2',
              currentLevel,
              category: targetBody.collisionFilter.category
            });
          } else { // pin에 연결된 것이 한 개 이상 있을 때
            let isOtherContraintBody = false
            let otherContraintBodyCategory;
            constraintsToRemove.forEach(ct => {
              const otherBody = 
              ct.bodyA === targetBody 
                ? ct.bodyB 
                : ct.bodyA;
  
              if(otherBody) {
                // (A) "constraintsToRemove" 이외의 Constraint 중에서,
                //      otherBody가 연결된 것이 있는지 검사
                const otherConstraints = allConstraints.filter(otherCt => {
                  // 이미 "constraintsToRemove"에 포함된 것 제외
                  if (constraintsToRemove.includes(otherCt)) return false;
  
                  // bodyA나 bodyB가 'otherBody'인지 확인
                  return otherCt.bodyA === otherBody || otherCt.bodyB === otherBody;
                });
                console.log("otherContraints: ", otherConstraints)
                // (B) otherConstraints가 비어 있다면 (= 0개),
                //     즉 "otherBody"가 이외의 다른 Constraint에 연결되지 않았다면
                if (otherConstraints.length === 0) {
                  // => 여기서 collisionFilter 변경
                  otherBody.collisionFilter = {
                    group: 0,
                    category: 0x0001, // 기본값 예시
                    mask: 0xFFFF
                  };
                } else { // "otherBody"가 이외의 다른 Constraint에 연결되어 있다면
                  isOtherContraintBody = true
                }
              }
  
  
              // Constraint 제거
              Matter.World.remove(engineRef.current.world, ct);
            });
            if(!isOtherContraintBody) {
              socket.emit('releaseCategory', {
                playerId: 'player2',
                currentLevel,
                category: targetBody.collisionFilter.category,
              });
            }
          }

          // 6) 마지막으로 해당 body 자체 제거
          Matter.World.remove(engineRef.current.world, targetBody);

          if(targetBody.label?.startsWith("nail")) {
            removeNail(targetBody);
          }

          console.log(`Body(label='${data.customId}') & all connected constraints removed`);
        }
      } else if(data.customId.startsWith("chain")) {
        console.log("sdfsdfasdfkjaslfdlkadsfjklfdsldsf")
        const constraintsToRemove = Matter.Composite.allConstraints(engineRef.current.world).filter(
          (ct) => ct.label && ct.label.startsWith(data.customId)
        );

        console.log("constraintsToRemove: ", constraintsToRemove);
        
        constraintsToRemove.forEach((ct) => {
          Matter.World.remove(engineRef.current.world, ct);
        }); 
      } else {
        // 2) customId에 해당하는 Body 찾기
        const bodyToRemove = allBodies.find(b => b.label === data.customId);
        if (!bodyToRemove) return;

        // 3) 원본 Body와 연결된 모든 Constraint를 찾는다
        const allConstraints = Matter.Composite.allConstraints(engineRef.current.world);
        const constraintsOfMainBody = allConstraints.filter(ct => {
          return ct.bodyA === bodyToRemove || ct.bodyB === bodyToRemove;
        });

        // 4) 해당 Constraint 제거 & 연결된 nail Body 처리
        constraintsOfMainBody.forEach(constraint => {
          const nail = 
          constraint.bodyA === bodyToRemove 
              ? constraint.bodyB 
              : constraint.bodyA;
          console.log("nail: ", nail?.label);
          const contraintsOfNail = allConstraints.filter(otherCt => {
            if (constraintsOfMainBody.includes(otherCt) || otherCt.label.startsWith("chain")) return false;
            return otherCt.bodyA === nail || otherCt.bodyB === nail;
          });
          console.log("contraintsOfNail: ", contraintsOfNail);
          if(contraintsOfNail.length === 0) {
            console.log("asdfasfdfdsfd")
            const nailToRemove = nail
            if(nailToRemove) {
              console.log("nailToRemove: ", nailToRemove.label);
              const customId = nailToRemove.label;
                // 서버에 삭제 요청 전송
                socket.emit('erase', {
                  customId,
                  playerId: 'player2',
                  currentLevel
                });
            }
            // Constraint 자체 제거
            Matter.World.remove(engineRef.current.world, constraint);
          } else {
            // Constraint 자체 제거
            Matter.World.remove(engineRef.current.world, constraint);
          }
        });
        // 5) 마지막으로 원본 Body 제거
        Matter.World.remove(engineRef.current.world, bodyToRemove);

        if (bodyToRemove.label?.startsWith("nail")) {
          removeNail(bodyToRemove);
        }
      }
    });
  
    return () => {
      socket.off('erase');
    };
  }, []);

  useEffect(() => {
    socket.on('push', (data: { force: { x: number; y: number }; playerId: string }) => {
      if (ballRef.current && !pushLock) {
        const ball = ballRef.current;
        Matter.Body.applyForce(ball, ball.position, data.force);
        
        // setPushLock(true);
      }
    });
  
    return () => {
      socket.off('push');
    };
  }, []);

  useEffect(() => {
    socket.on('changeTool', (data: { tool: 'pen' | 'eraser' | 'pin' | 'chain' | 'push'; playerId: string }) => {
      console.log(`Tool changed to: ${data.tool} by player: ${data.playerId}`);
      setTool(data.tool);
    });
  
    return () => {
      socket.off('changeTool');
    };
  }, []);

  useEffect(() => {
    socket.on('changeLevel', (data: { level: number; direction: string; playerId: string }) => {
      console.log(`Level changed to: ${data.level} by player: ${data.playerId}`);
      resetNails();
      setCurrentLevel(data.level); // 레벨 업데이트
      currentLevelRef.current = data.level //
      setGameEnded(false); // 게임 종료 상태 초기화
    });
  
    return () => {
      socket.off('changeLevel');
    };
  }, []);

  useEffect(() => {
    const canvas = cursorCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
  
    let animationFrameId: number | null = null;
  
    const draw = () => {
      // 캔버스를 초기화
      ctx.clearRect(0, 0, canvas.width, canvas.height);
  
      if (cursors.length > 0) {
        // console.log("draw");
        // 모든 커서를 다시 그림
        cursors.forEach(({ x, y, playerId }) => {
          ctx.beginPath();
          ctx.arc(x, y, 5, 0, Math.PI * 2); // 커서 그리기
          ctx.fillStyle = playerId === 'player1' ? 'blue' : 'red'; // 플레이어별 색상
          ctx.fill();
        });
        // 다음 애니메이션 프레임 요청
        animationFrameId = requestAnimationFrame(draw);
      } else {
        // 애니메이션 종료
        cancelAnimationFrame(animationFrameId!);
        animationFrameId = null;
      }
    };
  
    if (cursors.length > 0) {
      // 애니메이션 시작
      draw();
    }
  
    return () => {
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [cursors]);

  useEffect(() => {
    if (!canvasRef.current) return;

    // 렌더링 객체 초기화
    if (renderRef.current) {
      Matter.Render.stop(renderRef.current); // 이전 렌더 중지
      // renderRef.current.canvas.remove(); // 기존 캔버스 해제
      renderRef.current = null;
      console.log("렌더링 객체 초기화 완료")
    }

    const render = Matter.Render.create({
      canvas: canvasRef.current,
      engine: engineRef.current,
      options: {
        width: 800,
        height: 600,
        // hasBounds: true,
        // showCollisions: true,
        wireframes: false,
        background: '#f8f4e3',
      },
    });
    console.log("Render.create 완료")
    renderRef.current = render;

    // engineRef.current.world.gravity.y = 0.1;

    // 기존 러너가 있으면 중지
    if (runnerRef.current) {
      Matter.Runner.stop(runnerRef.current);
      runnerRef.current = null;
      console.log("기존 러너 중지 완료")
    }

    // 새로운 러너 생성 및 실행
    const runner = Matter.Runner.create({
      delta: 25,
      isFixed: true, // 고정된 시간 간격 유지
    });
    Matter.Runner.run(runner, engineRef.current);
    runnerRef.current = runner;

    Matter.Render.run(render);

    // 월드 및 레벨 초기화
    const world = engineRef.current.world;
    
    Matter.World.clear(world, false);
    
    // in your world-init useEffect
    const factory = levelFactories[currentLevel];
    if (factory) {
      const bodies = factory(world);   // ← returns all the bodies you just made
      bodies.forEach(body => {
        if (body.label.startsWith('nail')) {
          addNail(body);               // ← now your nailsRef will contain them
        }
        if (body.label === 'ball') {
          ballRef.current = body;      // ← and you’ll need this too for push/afterUpdate!
          
          initialBallPositionRef.current = {
            x: body.position.x,
            y: body.position.y
          };
        }
      });
    }



    // 공이 wall_bottom 아래로 떨어졌는지 확인
    const handleCollisionStart = (event: Matter.IEventCollision<Engine>) => {
      console.log('collisionStart event:', event);
      
      // event.pairs가 있는지 확인
      if (!event.pairs) return;

      event.pairs.forEach((pair) => {
        if (
          (pair.bodyA.label === 'ball' && pair.bodyB.label === 'balloon') ||
          (pair.bodyA.label === 'balloon' && pair.bodyB.label === 'ball')
        ) {
          setGameEnded(true);
        }
      });
    }

    const handleAfterUpdate = () => {
      const threshold = 40; // 공 및 사물 삭제 기준 높이
      const world = engineRef.current.world;

      // wall_bottom을 초기화 시점에 찾음
      const wallBottom = Matter.Composite.allBodies(world).find((body) => body.label === 'wall_bottom');
      if (!wallBottom) {
        // console.error('Wall bottom not found!');
        return;
      }
      const bodies = Matter.Composite.allBodies(world);

      if (ballRef.current) {
        const ball = ballRef.current;
        const wallBottom = Matter.Composite.allBodies(world).find(
          (body) => body.label === 'wall_bottom'
        );
    
        if (!wallBottom) {
          // console.error('Wall bottom not found!');
          return;
        }

        if (ball.position.y > wallBottom.bounds.max.y - threshold) {
          // console.log('Ball fell below the wall. Resetting position.');
          // 초기 위치로 이동
          Matter.Body.setPosition(ball, initialBallPositionRef.current);

          // 속도 초기화
          Matter.Body.setVelocity(ball, { x: 0, y: 0 });

          // 힘 초기화 (필요하면 추가)
          Matter.Body.setAngularVelocity(ball, 0);
          Matter.Body.applyForce(ball, ball.position, { x: 0, y: 0 });
        }
      }

      // 사용자 사물이 화면 아래로 떨어지면 서서히 삭제
      bodies.forEach((body) => {
        const wallBottom = bodies.find((b) => b.label === 'wall_bottom');
        if (!wallBottom) return;

        // 충돌한 사물의 `opacity` 감소
        if (!staticObjects.includes(body.label) && !body.isStatic) {
          const isTouchingFloor = Matter.SAT.collides(body, wallBottom)?.collided;

          if (isTouchingFloor) {
            body.render.opacity = body.render.opacity ?? 1; // 초기값 설정
            body.render.opacity -= 0.01; // 점진적으로 투명도 감소

            if (body.render.opacity <= 0 && !body.eraserEmitted) {
              body.eraserEmitted = true;
              console.log("CurrentLevel: ", currentLevelRef.current);
              socket.emit('erase', {
                customId: body.label,
                playerId: 'player2',
                currentLevel: currentLevelRef.current,
                isFall: true,
              });
              // Matter.World.remove(world, body); // 완전히 투명해지면 제거
            }
          }
        }
      });
    }
    
    Matter.Events.on(engineRef.current, 'collisionStart', handleCollisionStart);
    Matter.Events.on(engineRef.current, 'afterUpdate', handleAfterUpdate);

    // 정리 함수
    return () => {
      Matter.Events.off(engineRef.current, 'collisionStart', handleCollisionStart);
      Matter.Events.off(engineRef.current, 'afterUpdate', handleAfterUpdate);

      if (renderRef.current) Matter.Render.stop(renderRef.current);
      if (runnerRef.current) Matter.Runner.stop(runnerRef.current);
      Matter.World.clear(world, false);
      Matter.Engine.clear(engineRef.current);
    }

    // Matter.Runner.run(engineRef.current);
    // Matter.Render.run(render);

    // return () => {
    //   Matter.Render.stop(render);
    //   Matter.World.clear(world, false);
    //   Matter.Engine.clear(engineRef.current);
    // };
  }, [currentLevel, resetTrigger]);

  // 헬퍼 함수: 클릭 좌표와 선분(Constraint의 끝점) 사이의 최단 거리를 계산
  const distancePointToLineSegment = (
    point: { x: number; y: number },
    segA: { x: number; y: number },
    segB: { x: number; y: number }
  ): number => {
    const { x: x0, y: y0 } = point;
    const { x: x1, y: y1 } = segA;
    const { x: x2, y: y2 } = segB;
    const dx = x2 - x1;
    const dy = y2 - y1;
    const segLenSq = dx * dx + dy * dy;
    if (segLenSq === 0) return Math.hypot(x0 - x1, y0 - y1);
    let t = ((x0 - x1) * dx + (y0 - y1) * dy) / segLenSq;
    t = Math.max(0, Math.min(1, t));
    const cx = x1 + t * dx;
    const cy = y1 + t * dy;
    return Math.hypot(x0 - cx, y0 - cy);
  };

  // 헬퍼 함수: Constraint의 endpoint(월드 좌표)를 반환
  const getConstraintEndpoint = (
    constraint: Matter.Constraint,
    which: "A" | "B"
  ): { x: number; y: number } | null => {
    const body = which === "A" ? constraint.bodyA : constraint.bodyB;
    const pt = which === "A" ? constraint.pointA : constraint.pointB;
    if (body) {
      return { x: body.position.x + (pt?.x || 0), y: body.position.y + (pt?.y || 0) };
    } else if (pt) {
      return { x: pt.x, y: pt.y };
    }
    return null;
  };

  // 헬퍼 함수: 클릭 좌표(mousePos) 근처(임계값 이하)에 위치하면서 label이 "chain"으로 시작하는 Constraint 반환
  const getChainConstraintsNearPoint = (
    mousePos: { x: number; y: number },
    world: Matter.World,
    threshold: number = 5
  ): Matter.Constraint[] => {
    const allConstraints = Matter.Composite.allConstraints(world);
    return allConstraints.filter(constraint => {
      // 반드시 constraint의 label이 "chain"으로 시작해야 함
      if (!constraint.label || !constraint.label.startsWith("chain")) return false;

      const pA = getConstraintEndpoint(constraint, "A");
      const pB = getConstraintEndpoint(constraint, "B");
      if (!pA || !pB) return false;
      const dist = distancePointToLineSegment(mousePos, pA, pB);
      return dist <= threshold;
    });
  };

  const createPhysicsBody = (points: Matter.Vector[], myGenerated: boolean, collisionCategory: number, groupNumber: number, customId?: string) => {
    console.log("customId: ", customId);
    if (points.length < 2) return null;
    console.log("object generated");

    if(myGenerated) {
      // console.log("myGenerated True, points: ", points)
      console.log("myGenerated True, collisionCategory: ", collisionCategory)
    } else {
      // console.log("myGenerated False, points: ", points)
      console.log("myGenerated False, collisionCategory: ", collisionCategory)
    }

    if (myGenerated) {
      const logInfo: LogInfo = {
        player_number: currentTurn === "player1" ? 1 : 2,
        type: 'draw',
        timestamp: new Date(),
      };
      // saveLog(logInfo);
    }
  
    // Simplify the path to reduce physics complexity
    const simplified = points.filter((point, index) => {
      if (index === 0 || index === points.length - 1) return true;
      const prev = points[index - 1];
      const dist = Math.hypot(point.x - prev.x, point.y - prev.y);
      return dist > 2;
    });

    if(myGenerated) {
      console.log("myGenerated True, nails: ", nails)
    } else {
      console.log("myGenerated False, nails: ", nails)
    }

    if(myGenerated) {
      console.log("myGenerated True, groupNumber: ", groupNumber)
    } else {
      console.log("myGenerated False, groupNumber: ", groupNumber)
    }

    // Nail 검출: points와의 접점이 있는 nail 찾기
    const nailsInShape: Matter.Body[] = nailsRef.current.filter((nail) => {
      const shapeBounds = Matter.Bounds.create(simplified); // 도형의 경계 생성
      console.log("overlapasdfsdffds: ", Matter.Bounds.overlaps(nail.bounds, shapeBounds));
      return Matter.Bounds.overlaps(nail.bounds, shapeBounds); // nail과 도형의 경계 비교
    });

    console.log("nailsInShape(sdfadfsfds): ", nailsInShape);

    if (!myGenerated && nailsInShape.length > 0) {
      console.log("Detected ${nailsInShape.length} nails inside the shape.");
    }

    // **핀 로직 수정**
    if (tool === 'pin') {
      // 중심점 계산: points를 기반으로
      const centerX = points.reduce((sum, p) => sum + p.x, 0) / points.length;
      const centerY = points.reduce((sum, p) => sum + p.y, 0) / points.length;

      // 최대 반경 계산: points를 기반으로
      const radius = Math.max(
        ...points.map(p => Math.hypot(p.x - centerX, p.y - centerY))
      );

      // 클릭 위치에 존재하는 사물을 찾음
      const mousePosition = { x: centerX, y: centerY };
      const bodies = Matter.Composite.allBodies(engineRef.current.world);
      const targetBody = bodies.find((body) =>
        Matter.Bounds.contains(body.bounds, mousePosition) 
        // && !staticObjects.includes(body.label) // 고정된 사물은 제외
      );

      // 사물이 없으면 못을 생성하지 않음
      if (!targetBody) {
        console.log("No body found under the nail position.");
        return null;
      }

      const constraints = Matter.Composite.allConstraints(engineRef.current.world); // 모든 제약 조건 가져오기

      // targetBody에 연결된 constraints 찾기
      const connectedConstraints = constraints.filter(
        (constraint) =>
          constraint.bodyA === targetBody
      );

      const nailGroupNumber = connectedConstraints[0]?.bodyB?.collisionFilter.group;
      const nailCategory = connectedConstraints[0]?.bodyB?.collisionFilter.category;

      // 못(nail) 생성
      const nail = Matter.Bodies.circle(centerX, centerY, radius, {
        isStatic: targetBody.isStatic ? true : false,
        // collisionFilter: {
        //   category: 0x0002, // Nail의 카테고리
        //   mask: 0x0000,     // 어떤 것도 충돌하지 않도록 설정
        // },
        render: {
          // fillStyle: '#ef4444', // 못의 색상
          fillStyle: 'rgba(0, 0, 0, 0.0)', // 못의 색상
          strokeStyle: '#ef4444', // 못의 색상
          lineWidth: 2,
          // layer: 1,
        },
        label: customId || `nail_${Date.now()}`, // Assign customId
      });

      // 상태에 nail 추가
      // addNail(nail);
      console.log("sdfnail: ", nail);
      console.log("sdfnails: ", nails);
      
      // Matter.js 월드에 nail 추가
      // Matter.Composite.add(engineRef.current.world, nail);

      // 도형(targetBody)와 못(nail)을 Constraint로 연결
      const constraint = Matter.Constraint.create({
        bodyA: targetBody, // 도형
        pointA: { x: mousePosition.x - targetBody.position.x, y: mousePosition.y - targetBody.position.y }, // 도형 내부의 연결 지점
        bodyB: nail, // 못
        pointB: { x: 0, y: 0 }, // 못의 중심
        stiffness: 1, // 강성(도형과 못의 연결 강도)
        length: 0, // 길이 (0으로 설정해 못이 도형에 붙어 있게 함)
        render: {
          visible: false, // Constraint 시각화를 비활성화
        },
      });

      // Matter.js 월드에 Constraint 추가
      // Matter.Composite.add(engineRef.current.world, constraint);

      if (myGenerated && !customId) {
        console.log("핀 데이터를 서버로 전송");

        // 핀 데이터를 서버로 전송
        const customId = nail.label;
        socket.emit('drawPin', { centerX, centerY, radius, points: points, playerId: 'player2', customId, currentLevel, targetBodyCustomId: targetBody.label, nailGroupNumber, nailCategory});
      }

      // return {body: nail, nailsInShape: []};
      return nail;
    }
  
    // 기존 nail들의 category 값 가져오기
    const existingCategories = nailsRef.current
    .map((nail) => nail.collisionFilter.category)
    .filter((category): category is number => category !== undefined || category === collisionCategory);

    // 기존 nail들의 category 값을 |로 연결
    const additionalMask = existingCategories.reduce(
      (mask, category) => mask | category,
      0x0000 // 초기값 0
    );

    const vertices = [...simplified];
    if (vertices.length >= 3) {
      const bodyOptions = {
        render: {
          // fillStyle: '#3b82f6',
          fillStyle: 'rgba(0, 0, 0, 0.0)',
          strokeStyle: '#1d4ed8',
          lineWidth: 1,
        },
        isStatic: false, // 사물이 떨어지도록 설정
        friction: 0.8,
        frictionStatic: 1,
        restitution: 0.2,
        density: 0.005, // 밀도를 낮추어 떨어지는 속도를 줄임
        frictionAir: 0.02, // 공중 저항을 높임
        label: customId || `custom_${Date.now()}`, // Assign customId
        collisionFilter: {
          group: groupNumber,
          category: collisionCategory,
          mask: collisionCategory === 0x0001 ? 0xFFFF : (0xFFFF & ~collisionCategory), // 같은 카테고리끼리 충돌하지 않도록 설정,
        },
      };
      
      if(myGenerated) {
        console.log("myGenerated True, bodyOptions: ", bodyOptions)
      } else {
        console.log("myGenerated False, bodyOptions: ", bodyOptions)
      }
  
      // Use the center of mass as the initial position
      const centroidX = vertices.reduce((sum, v) => sum + v.x, 0) / vertices.length;
      const centroidY = vertices.reduce((sum, v) => sum + v.y, 0) / vertices.length;
  
      const translatedVertices = vertices.map(v => ({
        x: v.x - centroidX,
        y: v.y - centroidY,
      }));
  
      const body = Matter.Bodies.fromVertices(centroidX, centroidY, [translatedVertices], {
        ...bodyOptions,
      });

      if (body && myGenerated && !customId) {
        console.log("도형 데이터를 서버로 전송")
        // 도형 데이터를 서버로 전송
        const customId = body.label; // Use the label as the customId


        // socket.emit('drawShape', { points: simplified, playerId: 'player1', customId, currentLevel, nailsInShape: simplifiedNailsInShape });
        const nailsIdString = nailsInShape
        .map(nail => nail.label)  // nail.label이 customId라 가정
        .join(';');
        const nailCollisionCategory = nailsInShape[0]?.collisionFilter.category;
        const nailGroupNumber = nailsInShape[0]?.collisionFilter.group;
        if(nailCollisionCategory) {
          socket.emit('drawShape', { points: simplified, playerId: 'player2', customId, currentLevel, nailsIdString, collisionCategory: nailCollisionCategory, groupNumber: nailGroupNumber });
        } else {
          socket.emit('drawShape', { points: simplified, playerId: 'player2', customId, currentLevel });
        }
      }

      return {body, nailsInShape};
    }
  
    return null;
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const point = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    
    if (tool === 'chain') {
      // 클릭 위치에 있는 Body 중 label이 'nail'로 시작하는 것만 찾음
      const bodies = Matter.Query.point(
        Matter.Composite.allBodies(engineRef.current.world),
        point
      );
      const pin = bodies.find(body => body.label.startsWith('nail'));

      if (pin) {
        setSelectedPins(prevPins => {
          // 같은 pin이 이미 포함되었으면 추가하지 않음
          if (prevPins.includes(pin)) return [...prevPins];
          const newPins = [...prevPins, pin];

          // 만약 두 개의 핀이 선택되면 체인 생성
          if (newPins.length === 2) {
            // 만약 이미 chain emit이 이루어진 상태라면 반환 (중복 방지)
            if (chainEmittedRef.current) {
              return [];
            }
            const [pinA, pinB] = newPins;

            // 임의의 customId 부여 (예: chain_타임스탬프)
            const customId = `chain_${Date.now()}`;
            socket.emit('createChain', {
              playerId: 'player2',
              customId,
              pinAId: pinA.label, // 예: 'nail_123'
              pinBId: pinB.label, // 예: 'nail_456'
              stiffness: 0.0001,
              damping: 0.00001,
              length: Matter.Vector.magnitude(
                Matter.Vector.sub(pinB.position, pinA.position)
              ) * 1.1,
              currentLevel,
            });

            socket.emit('changeTurn', { nextPlayerId: 'player1', currentLevel });
            
            // 체인 생성 이벤트가 한 번 실행된 것으로 플래그 설정
            chainEmittedRef.current = true;

            // Optional: 일정 시간 후 다시 초기화 (예: 500ms 후)
            setTimeout(() => {
              chainEmittedRef.current = false;
            }, 500);

            // 선택한 핀 상태 초기화
            return [];
          }
          return newPins;
        });
      }
      return;
    }


    if (tool === 'eraser') {
      if (currentTurn === 'player1') return;
    
      // 1) 클릭 지점에 있는 모든 Body 조회
      const mousePosition = { x: point.x, y: point.y };
      const bodiesAtPoint = Matter.Query.point(
        Matter.Composite.allBodies(engineRef.current.world),
        mousePosition
      );
    
      // 2) “지울 수 있는” Body만 남기기  
      //    - isStatic true → 맵 구조물(벽, 타워, 별, 피벗 등) 자동 보호  
      //    - staticObjects.includes(label) → ball, balloon 등 시작 시 존재하는 동적 오브젝트 보호  
      const erodable = bodiesAtPoint.filter(body =>
        !body.isStatic &&
        !staticObjects.includes(body.label)
      );
    
      // 3) 못(nail) 지우기
      const nailBodies = erodable.filter(b => b.label.startsWith('nail'));
      if (nailBodies.length > 0) {
        const customId = nailBodies[0].label!;
        socket.emit('erase', {
          customId,
          playerId: 'player1',
          currentLevel,
          isFall: false,
        });
        socket.emit('changeTurn', { nextPlayerId: 'player1', currentLevel });
        return;
      }
    
      // 4) 체인 지우기
      const nearChains = getChainConstraintsNearPoint(
        mousePosition,
        engineRef.current.world,
        5
      );
      if (nearChains.length > 0) {
        const customId = nearChains[0].label!;
        if (customId.startsWith('chain')) {
          socket.emit('erase', {
            customId,
            playerId: 'player2',
            currentLevel,
            isRelease: false,
          });
          socket.emit('changeTurn', { nextPlayerId: 'player1', currentLevel });
        }
        return;
      }
    
      // 5) 그 외 지우기: erodable 에 남은 것만
      for (const body of erodable) {
        const customId = body.label!;
        socket.emit('erase', {
          customId,
          playerId: 'player2',
          currentLevel,
        });
        socket.emit('changeTurn', { nextPlayerId: 'player1', currentLevel });
        break;
      }
    
      return;
    }
    
    console.log("pushLock: ", pushLock);

    // if (tool === 'push' && ballRef.current && !pushLock) {
    if (tool === 'push' && ballRef.current) {
      // push 남용 방지
      // setPushLock(true);
      if(currentTurn === 'player1') return;
      
      const logInfo: LogInfo = {
        player_number: currentTurn === "player1" ? 1 : 2,
        type: 'push',
        timestamp: new Date(),
      };
      // saveLog(logInfo);

      // 턴 전환 로직
      // setCurrentTurn((prevTurn) => (prevTurn === "player1" ? "player2" : "player1"));

      const ball = ballRef.current;
      const ballX = ball.position.x;

      // 공의 중심에서 클릭한 위치까지의 거리 계산
      const clickOffsetX = point.x - ballX;

      const force = clickOffsetX < 0 ? { x: 0.008, y: 0 } : { x: -0.008, y: 0 };

      // 공에 힘을 가함
      // Matter.Body.applyForce(ball, ball.position, force);

      // 서버에 힘 적용 요청 전송
      socket.emit('push', {
        force,
        playerId: 'player2',
        currentLevel
      });
    }

    if(currentTurn === 'player2') {
      setIsDrawing(true);
      setDrawPoints([point]);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
  
    const rect = canvasRef.current.getBoundingClientRect();
    let point = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    // 서버로 마우스 위치 전송
    socket.emit('mouseMove', { x: point.x, y: point.y, playerId: 'player2' });

    if(!isDrawing || tool === 'eraser') return;

    // 캔버스 경계 안에 point를 제한
    point = {
      x: Math.max(0, Math.min(point.x, rect.width)), 
      y: Math.max(0, Math.min(point.y, rect.height)), 
    };
  
    // 벽과의 충돌 감지
    const bodies = Matter.Query.point(Matter.Composite.allBodies(engineRef.current.world), point);
    const collidedWall = bodies.find(body => body.label === 'wall');
    // console.log("collidedWall: ", collidedWall)
  
    if (collidedWall) {
      // 충돌한 벽의 경계 찾기
      const bounds = collidedWall.bounds;
  
      // 벽의 각 변과 점 사이의 거리 계산
      const distances = [
        Math.abs(point.x - bounds.min.x), // 왼쪽 변
        Math.abs(point.x - bounds.max.x), // 오른쪽 변
        Math.abs(point.y - bounds.min.y), // 위쪽 변
        Math.abs(point.y - bounds.max.y), // 아래쪽 변
      ];
  
      // 가장 가까운 변 찾기
      const minDistance = Math.min(...distances);
      // console.log("minDistance: ", minDistance)
      const threshold = 5; // 벽과의 거리 임계값
  
      if (minDistance < threshold) {
      if (distances[0] === minDistance) point.x = bounds.min.x; // 왼쪽 변
      else if (distances[1] === minDistance) point.x = bounds.max.x; // 오른쪽 변
      else if (distances[2] === minDistance) point.y = bounds.min.y; // 위쪽 변
      else if (distances[3] === minDistance) point.y = bounds.max.y; // 아래쪽 변
      }
    }
  
    const lastPoint = drawPoints[drawPoints.length - 1];
    // console.log("lastPoint: ", lastPoint)
    const dist = Math.hypot(point.x - lastPoint.x, point.y - lastPoint.y);
  
    if (dist > 5) {
      setDrawPoints(prev => [...prev, point]);
    }
  };
  
  const handleMouseUp = () => {
  
    if (tool === 'pen' || tool === 'pin') {
      if(currentTurn === 'player1') return;
      console.log("asdfkjsdlfjksld")
      const body = createPhysicsBody(drawPoints, true, 0x0001, 0);
      if (body) {
        // Matter.World.add(engineRef.current.world, body);
        
        socket.emit('changeTurn', { nextPlayerId: 'player1' });
        // 턴 전환 로직
        // setCurrentTurn((prevTurn) => (prevTurn === "player1" ? "player2" : "player1"));
      }
    }
  
    setIsDrawing(false);
    setDrawPoints([]);
  };

  const handleToolChange = (newTool: 'pen' | 'eraser' | 'pin' | 'chain' | 'push') => {
    if (currentTurn === 'player1') return;
    setTool(newTool);
    setIsDrawing(false);
    setDrawPoints([]);

    // Clear the selected pins
    setSelectedPins([]);

    // 서버로 tool 변경 전송
    socket.emit('changeTool', { tool: newTool, playerId: 'player2', currentLevel });
  };

  // const handleLevelChange = (direction: 'prev' | 'next') => {
  //   setCurrentLevel(prev => direction === 'next' ? prev + 1 : Math.max(1, prev - 1));
  // };
  const handleLevelChange = (direction: 'prev' | 'next') => {
    if (direction === 'next') {
      if (currentLevel < TOTAL_LEVELS) {
        const newLevel = currentLevel + 1;
        // setCurrentLevel(prev => prev + 1);
        // setGameEnded(false); // 게임 종료 상태 초기화

        const logInfo: LogInfo = {
          player_number: currentTurn === "player1" ? 1 : 2,
          type: 'move_next_level',
          timestamp: new Date(),
        };
        // saveLog(logInfo)
        
        // 서버로 레벨 변경 전송
        socket.emit('changeLevel', { level: newLevel, currentLevel, direction, playerId: 'player2' });
      } else {
        // showTemporaryMessage("실험이 마지막 스테이지입니다");
      }
    } else {
      if (currentLevel > 1) {
        const newLevel = currentLevel - 1;
        // setCurrentLevel(prev => prev - 1);
        
        const logInfo: LogInfo = {
          player_number: currentTurn === "player1" ? 1 : 2,
          type: 'move_prev_level',
          timestamp: new Date(),
        };
        // saveLog(logInfo)
        
        // 서버로 레벨 변경 전송
        socket.emit('changeLevel', { type: 'move_prev_level', level: newLevel, direction, playerId: 'player2', currentLevel, newLevel });
      } else {
        // showTemporaryMessage("첫 스테이지입니다");
      }
    }
  };

  const handleNextLevel = () => {
    if (currentLevel < TOTAL_LEVELS) {
      const newLevel = currentLevel + 1
      // setCurrentLevel((prevLevel) => prevLevel + 1)
      setGameEnded(false); // 게임 종료 상태 초기화

      // 서버로 레벨 변경 전송
      socket.emit('changeLevel', { level: newLevel, playerId: 'player2' });
    } else {
      // setCurrentLevel((prevLevel) => prevLevel)
      setGameEnded(false); // 게임 종료 상태 초기화
    }
  }

  const resetLevel = () => {
    const logInfo: LogInfo = {
      player_number: currentTurn === "player1" ? 1 : 2,
      type: 'refresh',
      timestamp: new Date(),
    };
    // saveLog(logInfo);

    // 서버로 초기화 이벤트 전송
    socket.emit('resetLevel', { playerId: 'player2', level: currentLevel });
  };

  // 누적해서 csv 파일 업데이트
  const saveLog = async (logInfo: LogInfo) => {
    try {
      console.log("ddd: ", {
        player_number: logInfo.player_number,
        type: logInfo.type,
        timestamp: logInfo.timestamp.toISOString(), // Convert timestamp to ISO format
      })
      await axios.post('http://localhost:3000/logger/log', {
        player_number: logInfo.player_number,
        type: logInfo.type,
        timestamp: logInfo.timestamp.toISOString(), // Convert timestamp to ISO format
      });
      console.log('Log saved successfully');
    } catch (error) {
      console.error('Failed to save log:', error);
    }
  }

  const drawOtherPlayerCursor = (x: number, y: number, playerId: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2); // 커서 그리기
    ctx.fillStyle = playerId === 'player1' ? 'blue' : 'red'; // 플레이어에 따라 색상 다르게
    ctx.fill();
  };
  
  const handleButtonClick = () => {
    console.log('Current cursors length:', cursors.length);
  };

  const handleShowBodies = () => {
    if (!engineRef.current) return;
    const allBodies = Matter.Composite.allBodies(engineRef.current.world);
    console.log("All Bodies:", allBodies);
  };

  return (
      <div className="flex flex-col items-center gap-4">
        {/* <Timer startTimer={startTimer} onFinish={handleTimerFinish} /> */}
        {/* 스테이지 상태 (1 ~ 10까지 예시) */}
        {/* 스테이지 상태 */}
      <div className="mt-4 p-4 border border-gray-300 rounded overflow-x-auto">
        <h3 className="text-lg font-bold mb-2">스테이지 상태</h3>
        <div className="flex flex-col gap-4">
          
          {/* 1~10 */}
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr>
                <th className="border p-2">스테이지</th>
                {Array.from({ length: 10 }, (_, i) => i + 1).map(level => (
                  <th key={level} className="border p-2 text-center">{level}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <th className="border p-2">상태</th>
                {Array.from({ length: 10 }, (_, i) => i + 1).map(level => {
                  const isCleared = completedLevels.includes(level);
                  return (
                    <td
                      key={level}
                      className={`border p-2 text-center font-bold text-white ${isCleared ? 'bg-green-500' : 'bg-red-500'}`}
                    >
                      {isCleared ? '완료' : '미완료'}
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>

          {/* 11~20 */}
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr>
                <th className="border p-2">스테이지</th>
                {Array.from({ length: 10 }, (_, i) => i + 11).map(level => (
                  <th key={level} className="border p-2 text-center">{level}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <th className="border p-2">상태</th>
                {Array.from({ length: 10 }, (_, i) => i + 11).map(level => {
                  const isCleared = completedLevels.includes(level);
                  return (
                    <td
                      key={level}
                      className={`border p-2 text-center font-bold text-white ${isCleared ? 'bg-green-500' : 'bg-red-500'}`}
                    >
                      {isCleared ? '완료' : '미완료'}
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>

        </div>
      </div>

        <div className="flex gap-4 mb-4">
          {/* <div>
            <button onClick={handleButtonClick}>Show Cursors Length</button>
          </div> */}
          <button onClick={handleShowBodies}>Show All Bodies</button>
          <button
            onClick={() => resetLevel()}
            className={`p-2 rounded 'bg-gray-200'`}
          >
            <RefreshCw size={24} />
          </button>
          <button
            onClick={() => handleToolChange('pen')}
            className={`p-2 rounded ${
              tool === 'pen' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            <Pen size={24} />
          </button>
          <button
            onClick={() => handleToolChange('eraser')}
            className={`p-2 rounded ${
              tool === 'eraser' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            <Eraser size={24} />
          </button>
          <button
            onClick={() => handleToolChange('pin')}
            className={`p-2 rounded ${
              tool === 'pin' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            <Pin size={24} />
          </button>
          {/* <button
            onClick={() => handleToolChange('chain')}
            className={`p-2 rounded ${
              tool === 'chain' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            <Link size={24} />
          </button> */}
          {/* 밀기 도구 버튼 */}
          <button
            onClick={() => handleToolChange('push')}
            className={`p-2 rounded relative ${tool === 'push' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* 공을 뒤에 배치 */}
            <Circle size={20} style={{ position: 'absolute', left: '6px', zIndex: 1 }} />
            {/* 손이 약간 겹치도록 배치 */}
            <Hand size={22} style={{ position: 'relative', left: '8px', zIndex: 2, transform: 'rotate(-20deg)' }} />
          </button>
        </div>

        <div className="flex items-center justify-between gap-4">
          <h2
            className={`text-lg font-bold ${
              currentTurn === 'player1' ? 'text-blue-500' : 'text-red-500'
            }`}
          >
            {currentTurn === 'player1' ? "플레이어1 차례" : "플레이어2 차례"}
          </h2>
        </div>
        
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className="border border-gray-300 rounded-lg shadow-lg"
            style={{ cursor: tool === 'eraser' ? 'crosshair' : 'default' }}
          />
          
          {/* 커서를 표시하는 별도의 캔버스 */}
          <canvas
            ref={cursorCanvasRef}
            width={800}
            height={600}
            className="absolute top-0 left-0 border border-transparent pointer-events-none"
            style={{
              zIndex: 10, // 게임 캔버스 위에 렌더링
            }}
          />
          
          {isDrawing && tool === 'pen' && (
            <svg
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                pointerEvents: 'none',
              }}
              width={800}
              height={600}
            >
              <path
                d={`M ${drawPoints.map(p => `${p.x},${p.y}`).join(' L ')}`}
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2"
                strokeDasharray="4"
              />
            </svg>
          )}

          {gameEnded && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-8 rounded-lg shadow-xl">
                <h2 className="text-3xl font-bold text-center mb-4">레벨 클리어!</h2>
                <button
                  onClick={() => handleNextLevel()}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  {currentLevel < TOTAL_LEVELS ? '다음 레벨로 이동' : '확인'}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => handleLevelChange('prev')}
            disabled={currentLevel === 1}
            className="p-2 rounded bg-gray-200 disabled:opacity-50"
          >
            <ChevronLeft size={24} />
          </button>
          <span className="py-2 px-4 bg-gray-100 rounded">스테이지 {currentLevel}</span>
          <button
            onClick={() => handleLevelChange('next')}
            disabled={currentLevel === TOTAL_LEVELS}
            className="p-2 rounded bg-gray-200 disabled:opacity-50"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
      // )}
    // </div>
  );
};

export default PhysicsCanvas;