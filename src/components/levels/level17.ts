// src/levels/level22.ts
import Matter from 'matter-js';
import type { LevelFactory } from './index';

export const createLevel17: LevelFactory = (world) => {
  // 기본 벽 옵션
  const wallOptions = {
    isStatic: true,
    label: 'wall',
    collisionFilter: {
    category: 0x0001,
    mask: 0xFFFF,
    },
  };
  const walls = [
    Matter.Bodies.rectangle(400, 610, 810, 20, { ...wallOptions, label: 'wall_bottom' }),
  ];
  walls.forEach((wall) => {
    Matter.Body.setStatic(wall, true);
    wall.render.fillStyle = '#94a3b8';
  });

  // 1) 위쪽에 오른쪽 아래로 기울어진 대각선 플랫폼
  const diagTop = Matter.Bodies.rectangle(
    450,   // X 위치
    100,   // Y 위치
    300,   // 길이
    20,    // 두께
    {
      isStatic: true,
      label: 'diagTop_22',
      angle: (3 * Math.PI) / 25,  // 기울기
      render: { fillStyle: '#6b7280' },
      collisionFilter: { category: 0x0001, mask: 0xFFFF },
    }
  );

  // 2) 공 생성 및 초기 위치 저장
  const BallX = 350;
  const BallY = 50;
  const ball = Matter.Bodies.circle(
    BallX,
    BallY,
    15,
    {
      label: 'ball',
      frictionAir:  0.001,  
      render: { fillStyle: '#ef4444' },
      collisionFilter: { category: 0x0001, mask: 0xFFFF },
    }
  );
  // initialBallPositionRef.current = { x: BallX, y: BallY };
  // ballRef.current = ball;

  // 3) 아래쪽에 동일한 기울기의 대각선 플랫폼
  const diagBottom = Matter.Bodies.rectangle(
    550,
    300,
    300,
    20,
    {
      isStatic: true,
      label: 'diagBottom_22',
      angle: (-3 * Math.PI) / 25,
      render: { fillStyle: '#6b7280' },
      collisionFilter: { category: 0x0001, mask: 0xFFFF },
    }
  );

  // 4) 위쪽 플랫폼 끝 지점 근처에 짧은 가로 박스
  const shortH1 = Matter.Bodies.rectangle(
    300,  
    400,  
    150,  
    30,   
    {
      isStatic: true,
      label: 'shortH1_22',
      render: { fillStyle: '#6b7280' },
      collisionFilter: { category: 0x0001, mask: 0xFFFF },
    }
  );

  // 5) 가로박스 옆에 세로 박스
  const shortV = Matter.Bodies.rectangle(
    100,
    380,
    30,
    150,
    {
      isStatic: true,
      label: 'shortV_22',
      render: { fillStyle: '#6b7280' },
      collisionFilter: { category: 0x0001, mask: 0xFFFF },
    }
  );

  // 6) 세로박스 아래에 짧은 가로 박스
  const shortH2 = Matter.Bodies.rectangle(
    200,
    570,
    150,
    30,
    {
      isStatic: true,
      label: 'shortH2_22',
      render: { fillStyle: '#6b7280' },
      collisionFilter: { category: 0x0001, mask: 0xFFFF },
    }
  );

  // 7) 오른쪽 하단에 짧은 가로 박스
  const bottomH = Matter.Bodies.rectangle(
    750,
    550,
    100,
    20,
    {
      isStatic: true,
      label: 'bottomH_22',
      render: { fillStyle: '#6b7280' },
      collisionFilter: { category: 0x0001, mask: 0xFFFF },
    }
  );

  // 8) bottomH 위에 별 생성
  const star = Matter.Bodies.trapezoid(
    750,
    525,
    20,
    20,
    1,
    {
      isStatic: true,
      label: 'balloon',
      render: { fillStyle: '#fbbf24' },
      collisionFilter: { category: 0x0001, mask: 0x0001 },
    }
  );

  // 월드에 바디 추가
  Matter.World.add(world, [...walls,
    diagTop, ball, diagBottom,
    shortH1, shortV, shortH2,
    bottomH, star,
  ]);

  return [...walls,
    diagTop, ball, diagBottom,
    shortH1, shortV, shortH2,
    bottomH, star,
  ];
};
