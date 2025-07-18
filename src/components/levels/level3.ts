// src/levels/level5.ts
import Matter from 'matter-js';
import type { LevelFactory } from './index';

// 전역으로 사용 중인 socket을 가져옵니다
import { socket } from '../../socket';

export const createLevel3: LevelFactory = (world) => {
  // 1) 바닥 벽 생성
  const wallOptions: Matter.IBodyDefinition = {
    isStatic: true,
    label: 'wall',
    collisionFilter: {
      group: -1,
      category: 0x0001,
      mask: 0xFFFF,
    },
    render: { fillStyle: '#94a3b8' },
  };
  const walls = [
    Matter.Bodies.rectangle(400, 610, 810, 20, { ...wallOptions, label: 'wall_bottom' }),
  ];

  // 2) 못(Nail) 생성 및 등록
  const radius = 10;
  const nailPositions = [
    { x: 475, y: 240, id: 'nail4_0' },
  ];
  const nails = nailPositions.map(({ x, y, id }) => {
    const nail = Matter.Bodies.circle(x, y, radius, {
      isStatic: id === 'nail4_0',              // 첫 번째 못만 고정
      label: id,
      collisionFilter: {
        group: -1,
        category: 0x0002,                     // Nail 카테고리
        mask: 0xFFFF & ~0x0002, // 같은 카테고리끼리 충돌하지 않도록 설정
      },
      render: {
        fillStyle: 'rgba(0,0,0,0)',
        strokeStyle: '#fbbf24',
        lineWidth: 3,
      },
      mass: 30,
    });

    

    // pin 등록 콜백 호출
    socket.emit('registerPin', {
      centerX: x,
      centerY: y,
      radius,
      playerId: 'player2',
      customId: id,
      currentLevel: 5,
    });
    // addNail(nail4_0);

    return nail;
  });

  // 3) 공 및 장애물 생성
  const ball = Matter.Bodies.circle(400, 442, 15, {
    render: { fillStyle: '#ef4444' },
    label: 'ball',
    frictionAir:  0.001,  
    collisionFilter: { category: 0x0001, mask: 0xFFFF },
  });
  const obstacle = Matter.Bodies.rectangle(400, 150, 100, 150, {
    isStatic: true,
    label: 'obstacle',
    render: { fillStyle: '#6b7280' },
    collisionFilter: { category: 0x0001, mask: 0xFFFF },
  });

  // 4) 스쿱(Scoop) 생성
  const handle = Matter.Bodies.rectangle(475, 240, 50, 420, {
    label: 'handle',
    collisionFilter: { group: -1, category: 0x0002, mask: 0xFFFD},
    render: { fillStyle: '#10b981' },
  });
  const head1 = Matter.Bodies.rectangle(425, 475, 150, 50, {
    label: 'head1',
    collisionFilter: { group: -1, category: 0x0002, mask: 0xFFFD},
    render: { fillStyle: '#10b981' },
  });
  const head2 = Matter.Bodies.rectangle(325, 450, 50, 100, {
    label: 'head2',
    collisionFilter: { group: -1, category: 0x0002, mask: 0xFFFD},
    render: { fillStyle: '#10b981' },
  });
  const scoop = Matter.Body.create({
    parts: [handle, head1, head2],
    isStatic: false,
    label: 'scoop',
    collisionFilter: { group: -1, category: 0x0002, mask: 0xFFFD},
  });

  // 5) 별(Star) 생성
  const star = Matter.Bodies.trapezoid(300, 335, 20, 20, 1, {
    render: { fillStyle: '#fbbf24' },
    label: 'balloon',
    isStatic: true,
    collisionFilter: { category: 0x0001, mask: 0x0001 },
  });

  // 6) 제약조건(Constraints) 생성: 스쿱 ↔ 못
  const constraints = nailPositions.map(({ x, y }, i) =>
    Matter.Constraint.create({
      bodyA: scoop,
      pointA: { x: x - scoop.position.x, y: y - scoop.position.y },
      bodyB: nails[i],
      pointB: { x: 0, y: 0 },
      stiffness: 1,
      length: 0,
      render: { visible: false },
    })
  );

  // 7) 월드에 모두 추가
  Matter.World.add(world, [
    ...walls,
    ball,
    obstacle,
    scoop,
    star,
    ...nails,
    ...constraints,
  ]);

  // 8) 반환 (제약조건 제외)
  return [...walls, ball, obstacle, scoop, ...nails, star];
};
