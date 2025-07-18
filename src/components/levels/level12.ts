// src/levels/level8.ts
import Matter from 'matter-js';
import type { LevelFactory } from './index';

export const createLevel12: LevelFactory = (world) => {
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

  // 공 생성
  const ball = Matter.Bodies.circle(100, 490, 15, {
    render: { fillStyle: '#ef4444' },
    label: 'ball',
    frictionAir:  0.001,  
    collisionFilter: { category: 0x0001, mask: 0xFFFF },
  });

  // 바닥 플랫폼
  const floor = Matter.Bodies.rectangle(400, 550, 750, 80, {
    isStatic: true,
    label: 'floor',
    render: { fillStyle: '#6b7280' },
    collisionFilter: { category: 0x0001, mask: 0xFFFF },
  });

  // T자 구조물 생성)
  const Ishape = Matter.Bodies.rectangle(500, 295, 30, 430, {
    isStatic: false,
    label: 'Ishape',
    render: { fillStyle: '#4B0082' },
    collisionFilter: { group: -1, category: 0x0002, mask: 0xFFFF & ~0x0002 },
    density: 0.00026
  });
  const upperrectangle = Matter.Bodies.rectangle(500, 85, 150, 30, {
    isStatic: false,
    label: 'upperrectangle',
    render: { fillStyle: '#4B0082' },
    collisionFilter: { group: -1, category: 0x0002, mask: 0xFFFF & ~0x0002 },
    density: 0.00026
  });
  const Tshape = Matter.Body.create({
    parts: [upperrectangle, Ishape],
    label: 'Tshape',
    collisionFilter: { group: -1, category: 0x0002, mask: 0xFFFF & ~0x0002 },
  });

  // 목표(별) 생성
  const star = Matter.Bodies.trapezoid(700, 495, 20, 20, 1, {
    render: { fillStyle: '#fbbf24' },
    label: 'balloon',
    isStatic: true,
    collisionFilter: { category: 0x0001, mask: 0x0001 },
  });

  // 못(Nail) 생성 및 제약
  const nailData = [
    { x: 500, y: 300, id: 'nail_Tshape' },
  ];
  const nails = nailData.map(({ x, y, id }) =>
    Matter.Bodies.circle(x, y, 10, {
      isStatic: true,
      label: id,
      collisionFilter: { group: -1, category: 0x0002, mask: 0x0000 },
      render: { fillStyle: 'rgba(0,0,0,0)', strokeStyle: '#fbbf24', lineWidth: 3 },
      mass: 30,
    })
  );
  const constraints = nails.map((nail, i) =>
    Matter.Constraint.create({
      bodyA: Tshape,
      pointA: { x: nailData[i].x - Tshape.position.x, y: nailData[i].y - Tshape.position.y },
      bodyB: nail,
      pointB: { x: 0, y: 0 },
      stiffness: 1,
      length: 0,
      render: { visible: false },
      label: 'constraint_Tshape'
    })
  );

  // 월드에 바디 추가
  Matter.World.add(world, [...walls,
    ...walls,
    ball,
    star,
    floor,
    Tshape,
    ...nails,
    ...constraints,
  ]);

  return [...walls,
    ...walls,
    ball,
    star,
    floor,
    Tshape,
    ...nails,
  ];
};