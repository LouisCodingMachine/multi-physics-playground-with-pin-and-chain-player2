import Matter from 'matter-js';
import type { LevelFactory } from './index';

// 후보군을 파일 상단이나 외부에서 정의해둡니다.
const fulcrumCandidates = [
    { x: 420, y: 350 },
    { x: 450, y: 350 },
  { x: 480, y: 350 },
  { x: 530, y: 350 },
  { x: 560, y: 350 },
];
// candidates 갯수만큼 반복되게 할 수도 있고, 원하시는 규칙에 따라 접근 가능

// 현재 인덱스를 어디에 저장할지에 따라 방식이 달라집니다.
// 예시: 그냥 전역 변수 (테스트용)
let fulcrumIndex = 0; // import/export 해서 관리하거나, 레벨마다 별도 관리 가능

export const createLevel9: LevelFactory = (world) => {
  // 1) 바닥 생성
  const floor = Matter.Bodies.rectangle(400, 610, 810, 20, {
    isStatic: true,
    label: 'wall_bottom',
    render: { fillStyle: '#94a3b8' },
    collisionFilter: { category: 0x0001, mask: 0xFFFF },
  });

  // 2) 받침용 박스
  const support1 = Matter.Bodies.rectangle(180, 420, 40, 20, {
    isStatic: true,
    label: 'support1',
    render: { fillStyle: '#10b981' },
    collisionFilter: { category: 0x0001, mask: 0xFFFF },
  });
  const support2 = Matter.Bodies.rectangle(300, 220, 40, 20, {
    isStatic: true,
    label: 'support2',
    render: { fillStyle: '#10b981' },
    collisionFilter: { category: 0x0001, mask: 0xFFFF },
  });

  // 3) 레버 판자
  const plank = Matter.Bodies.rectangle(400, 350, 650, 20, {
    density: 0,
    friction: 0,
    restitution: 0.5,
    label: 'leverPlank',
    render: { fillStyle: '#6b7280' },
    collisionFilter: { category: 0x0001, mask: 0xFFFF },
  });

  // 4) 왼쪽 스쿱
  const leftBase  = Matter.Bodies.rectangle(120, 340,  80, 10, { render: { fillStyle: '#4B5563' }, collisionFilter: { category: 0x0001, mask: 0xFFFF } });
  const leftWallA = Matter.Bodies.rectangle(80, 325,  10, 40, { render: { fillStyle: '#4B5563' }, collisionFilter: { category: 0x0001, mask: 0xFFFF } });
  const leftWallB = Matter.Bodies.rectangle(160, 325,  10, 40, { render: { fillStyle: '#4B5563' }, collisionFilter: { category: 0x0001, mask: 0xFFFF } });

  // 5) 오른쪽 스쿱
  const rightBase  = Matter.Bodies.rectangle(570, 340, 300, 10, { render: { fillStyle: '#4B5563' }, collisionFilter: { category: 0x0001, mask: 0xFFFF } });
  const rightWallA = Matter.Bodies.rectangle(420, 325, 10,  40, { render: { fillStyle: '#4B5563' }, collisionFilter: { category: 0x0001, mask: 0xFFFF } });
  const rightWallB = Matter.Bodies.rectangle(720, 325, 10,  40, { render: { fillStyle: '#4B5563' }, collisionFilter: { category: 0x0001, mask: 0xFFFF } });

  // 후보군에서 fulcrum 위치 선택
  const chosen = fulcrumCandidates[fulcrumIndex % fulcrumCandidates.length];
  // 다음 진입 시 다음 위치가 되도록 인덱스 증가
  fulcrumIndex++;

  // fulcrum 생성 (선택한 위치)
  const fulcrum = Matter.Bodies.circle(chosen.x, chosen.y, 10, {
    isStatic: true,
    label: 'fulcrum',
    render: { fillStyle: 'rgba(0,0,0,0)', strokeStyle: '#fbbf24', lineWidth: 1 },
    collisionFilter: { group: -1, category: 0x0002, mask: 0x0000 },
  });

  // 6) 레버 복합체 생성
  const lever = Matter.Body.create({
    parts: [plank, leftBase, leftWallA, leftWallB, rightBase, rightWallA, rightWallB],
    label: 'lever',
    render: { visible: true },
    collisionFilter: { category: 0x0001, mask: 0xFFFF },
  });

  const pivot = Matter.Constraint.create({
    bodyA: lever,
    pointA: { x: chosen.x - lever.position.x, y: chosen.y - lever.position.y },
    bodyB: fulcrum,
    pointB: { x: 0, y: 0 },
    length: 0,
    stiffness: 1,
    render: { visible: false },
  });

  // 9) 공 생성
  const ball = Matter.Bodies.circle(100, 300, 15, {
    frictionAir:  0,
    friction: 0,  
    label: 'ball',
    render: { fillStyle: '#ef4444' },
    collisionFilter: { category: 0x0001, mask: 0xFFFF },
  });

  // 10) 별 생성
  const star = Matter.Bodies.trapezoid(400, 130, 20, 20, 1, {
    isStatic: true,
    label: 'balloon',
    render: { fillStyle: '#fbbf24' },
    collisionFilter: { category: 0x0001, mask: 0x0001 },
  });

  // 월드에 바디 추가
  Matter.World.add(world, [
    floor, support1, support2,
    lever, fulcrum, pivot,
    ball, star,
  ]);

  // 반환
  return [
    floor, support1, support2,
    lever, fulcrum, pivot,
    ball, star,
  ];
};