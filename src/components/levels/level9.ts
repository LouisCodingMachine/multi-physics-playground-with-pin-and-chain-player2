// src/levels/level14.ts
import Matter from 'matter-js';
import type { LevelFactory } from './index';

export const createLevel9: LevelFactory = (world) => {
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

  // 1) 바닥 생성
  const floor = Matter.Bodies.rectangle(400, 610, 810, 20, {
    isStatic: true,
    label: 'wall_bottom',
    render: { fillStyle: '#94a3b8' },
    collisionFilter: { category: 0x0001, mask: 0xFFFF },
  });

  // 2) 왼쪽 받침용 박스
  const support1 = Matter.Bodies.rectangle(50, 480, 40, 20, {
    isStatic: true,
    label: 'support1',
    render: { fillStyle: '#10b981' },
    collisionFilter: { category: 0x0001, mask: 0xFFFF },
  });

  const support2 = Matter.Bodies.rectangle(260, 250, 40, 20, {
    isStatic: true,
    label: 'support1',
    render: { fillStyle: '#10b981' },
    collisionFilter: { category: 0x0001, mask: 0xFFFF },
  });

  // 3) 레버 판자
  const plank = Matter.Bodies.rectangle(400, 350, 470, 20, {
    label: 'leverPlank',
    density: 0.0001,
    friction: 0,
    frictionStatic: 0,
    restitution: 1,
    render: { fillStyle: '#6b7280' },
    collisionFilter: { category: 0x0001, mask: 0xFFFF },
  });

  // 4) 왼쪽 스쿱
  const leftBase  = Matter.Bodies.rectangle(200, 340,  80, 10, { render: { fillStyle: '#4B5563' }, collisionFilter: { category: 0x0001, mask: 0xFFFF } });
  const leftWallA = Matter.Bodies.rectangle(160, 325,  10, 40, { render: { fillStyle: '#4B5563' }, collisionFilter: { category: 0x0001, mask: 0xFFFF } });
  const leftWallB = Matter.Bodies.rectangle(240, 325,  10, 40, { render: { fillStyle: '#4B5563' }, collisionFilter: { category: 0x0001, mask: 0xFFFF } });

  // 5) 오른쪽 스쿱
  const rightBase  = Matter.Bodies.rectangle(600, 340, 140, 10, { render: { fillStyle: '#4B5563' }, collisionFilter: { category: 0x0001, mask: 0xFFFF } });
  const rightWallA = Matter.Bodies.rectangle(530, 325, 10,  40, { render: { fillStyle: '#4B5563' }, collisionFilter: { category: 0x0001, mask: 0xFFFF } });
  const rightWallB = Matter.Bodies.rectangle(670, 325, 10,  40, { render: { fillStyle: '#4B5563' }, collisionFilter: { category: 0x0001, mask: 0xFFFF } });

  // 6) 레버 복합체 생성
  const lever = Matter.Body.create({
    parts: [plank, leftBase, leftWallA, leftWallB, rightBase, rightWallA, rightWallB],
    label: 'lever',
    render: { visible: true },
    collisionFilter: { category: 0x0001, mask: 0xFFFF },
  });

  // 7) 지렛대 축
  const fulcrum = Matter.Bodies.circle(300, 370, 10, {
    isStatic: true,
    label: 'fulcrum',
    render: { fillStyle: 'rgba(0,0,0,0)', strokeStyle: '#fbbf24', lineWidth: 1 },
    collisionFilter: { group: -1, category: 0x0002, mask: 0x0000 },
  });

  // 8) 힌지 연결
  const pivot = Matter.Constraint.create({
    bodyA: lever,
    pointA: { x: 30, y: 0 },
    bodyB: fulcrum,
    pointB: { x: 0, y: 0 },
    length: 0,
    stiffness: 1,
    render: { visible: false },
  });

  // 9) 공 생성
  const ball = Matter.Bodies.circle(50, 310, 15, {
    label: 'ball',
      // 밀도: 면적(Area) × density 로 mass를 계산
    frictionAir:  0.001,   
    render: { fillStyle: '#ef4444' },
    collisionFilter: { category: 0x0001, mask: 0xFFFF },
  });

  // 10) 별 생성
  const star = Matter.Bodies.trapezoid(700, 500, 20, 20, 1, {
    isStatic: true,
    label: 'balloon',
    render: { fillStyle: '#fbbf24' },
    collisionFilter: { category: 0x0001, mask: 0x0001 },
  });

  // 11) 추가 박스 생성
  const upperRightBox = Matter.Bodies.rectangle(750, 120, 20, 80, { isStatic: true, label: 'upper_right_box', render: { fillStyle: '#10b981' }, collisionFilter: { category: 0x0001, mask: 0xFFFF } });
  const lowerRightBox = Matter.Bodies.rectangle(750, 350, 20, 150, { isStatic: true, label: 'lower_right_box', render: { fillStyle: '#10b981' }, collisionFilter: { category: 0x0001, mask: 0xFFFF } });
  const lowerLeftBox  = Matter.Bodies.rectangle(650, 425, 20, 80, { isStatic: true, label: 'lower_left_box', render: { fillStyle: '#10b981' }, collisionFilter: { category: 0x0001, mask: 0xFFFF } });
  const upperLeftBox  = Matter.Bodies.rectangle(620, 385, 80, 20, { isStatic: true, label: 'upper_left_box', render: { fillStyle: '#10b981' }, collisionFilter: { category: 0x0001, mask: 0xFFFF } });
  const bottomBox     = Matter.Bodies.rectangle(700, 520, 80, 20, { isStatic: true, label: 'bottom_box', render: { fillStyle: '#10b981' }, collisionFilter: { category: 0x0001, mask: 0xFFFF } });

  // 월드에 바디 추가
  Matter.World.add(world, [
    ...walls,
    floor, support1,support2,
    lever, fulcrum, pivot,
    ball, star,
    bottomBox,
  ]);

  // 반환
  return [
    ...walls,
    floor, support1,support2,
    lever, fulcrum, pivot,
    ball, star,
    bottomBox
  ];
};