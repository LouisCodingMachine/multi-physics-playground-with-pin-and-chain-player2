// src/levels/level6.ts
import Matter from 'matter-js';
import type { LevelFactory } from './index';

export const createLevel6: LevelFactory = (world) => {
  // 바닥 벽 생성
  const wallOptions = {
    isStatic: true,
    label: 'wall',
    collisionFilter: { category: 0x0001, mask: 0xFFFF },
  };
  const walls = [
    Matter.Bodies.rectangle(400, 610, 810, 20, { ...wallOptions, label: 'wall_bottom' }),
  ];
  walls.forEach((wall) => {
    Matter.Body.setStatic(wall, true);
    wall.render.fillStyle = '#94a3b8';
  });

  // 공 생성
  const ball = Matter.Bodies.circle(150, 400, 15, {
    render: { fillStyle: '#ef4444' },
    label: 'ball',
    restitution: 0.3,
    friction: 0.05,
    frictionAir: 0.01,
    collisionFilter: { category: 0x0001, mask: 0xFFFF },
  });

  // 하단 플랫폼 생성
  const horizontalDownPlatform = Matter.Bodies.rectangle(150, 450, 200, 150, {
    isStatic: true,
    label: 'horizontal_down_platform',
    render: { fillStyle: '#6b7280' },
    collisionFilter: { group: -1, category: 0x0002, mask: 0xFFFF & ~0x0002 },
  });

  // 목표(별) 생성
  const star = Matter.Bodies.trapezoid(700, 350, 20, 20, 1, {
    render: { fillStyle: '#fbbf24' },
    label: 'balloon',
    isStatic: true,
    collisionFilter: { category: 0x0001, mask: 0x0001 },
  });

  // 못(Nail) 생성 및 제약 생성
  const nailData = [
    { x: 230, y: 410, id: 'nail7_0' },
    { x:  70, y: 410, id: 'nail7_1' },
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
      bodyA: horizontalDownPlatform,
      pointA: {
        x: nailData[i].x - horizontalDownPlatform.position.x,
        y: nailData[i].y - horizontalDownPlatform.position.y,
      },
      bodyB: nail,
      pointB: { x: 0, y: 0 },
      stiffness: 1,
      length: 0,
      render: { visible: false },
    })
  );

  // 월드에 추가
  Matter.World.add(world, [
    ...walls,
    ball,
    star,
    horizontalDownPlatform,
    ...nails,
    ...constraints,
  ]);

  // 반환 (Constraint 제외)
  return [
    ...walls,
    ball,
    star,
    horizontalDownPlatform,
    ...nails,
  ];
};
