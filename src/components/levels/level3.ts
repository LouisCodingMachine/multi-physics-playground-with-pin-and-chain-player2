// src/levels/level3.ts
import Matter from 'matter-js';
import type { LevelFactory } from './index';

export const createLevel3: LevelFactory = (world) => {
  // 기본 벽 옵션
  const wallOptions = {
    isStatic: true,
    label: 'wall',
    collisionFilter: {
    category: 0x0001,
    mask: 0xFFFF,
    },
  };

  // 바닥 벽 생성
  const walls = [
    Matter.Bodies.rectangle(
      400,
      610,
      810,
      20,
      { ...wallOptions, label: 'wall_bottom' }
    ),
    // Matter.Bodies.rectangle(400, -10, 810, 20, wallOptions),
    // Matter.Bodies.rectangle(-10, 300, 20, 620, wallOptions),
    // Matter.Bodies.rectangle(810, 300, 20, 620, wallOptions),
  ];

  walls.forEach((wall) => {
    Matter.Body.setStatic(wall, true);
    wall.render.fillStyle = '#94a3b8';
  });

  // 공 생성
  const ball = Matter.Bodies.circle(150, 460, 15, {
    render: { fillStyle: '#ef4444' },
    label: 'ball',
    frictionAir:  0.001,  
    collisionFilter: {
      category: 0x0001,
      mask: 0xFFFF,
    },
  });

  // 별(목표) 생성
  const star = Matter.Bodies.trapezoid(730, 465, 20, 20, 1, {
    render: { fillStyle: '#fbbf24' },
    label: 'balloon',
    isStatic: true,
    collisionFilter: {
      category: 0x0001,
      mask: 0x0001,
    },
  });

  // 공용 수평 플랫폼
  const horizontalPlatformForBall = Matter.Bodies.rectangle(
    150,
    500,
    30,
    30,
    {
      isStatic: true,
      label: 'horizontalPlatformForBall',
      render: { fillStyle: '#6b7280' },
      collisionFilter: {
        category: 0x0001,
        mask: 0xFFFF,
      },
    }
  );

  const horizontalPlatform = Matter.Bodies.rectangle(
    500,
    565,
    500,
    100,
    {
      isStatic: true,
      label: 'horizontal_platform',
      render: { fillStyle: '#6b7280' },
      collisionFilter: {
        category: 0x0001,
        mask: 0xFFFF,
      },
    }
  );

  // 경사로 생성
  const slope = Matter.Bodies.rectangle(615, 498, 200, 5, {
    isStatic: true,
    label: 'slope',
    angle: -Math.PI / 15,
    render: { fillStyle: '#6c757d' },
    collisionFilter: {
      category: 0x0001,
      mask: 0xFFFF,
    },
  });

  // 별용 수평 플랫폼
  const horizontalPlatformForStar = Matter.Bodies.rectangle(
    730,
    495,
    40,
    40,
    {
      isStatic: true,
      label: 'horizontalPlatformForStar',
      render: { fillStyle: '#6b7280' },
      collisionFilter: {
        category: 0x0001,
        mask: 0xFFFF,
      },
    }
  );

  // 구름 생성
  const cloudVertices = [
    { x: 0, y: 20 },
    { x: 20, y: 0 },
    { x: 50, y: -5 },
    { x: 80, y: 0 },
    { x: 100, y: 20 },
    { x: 90, y: 40 },
    { x: 70, y: 50 },
    { x: 50, y: 45 },
    { x: 30, y: 50 },
    { x: 10, y: 40 },
  ];
  const cloud = Matter.Bodies.fromVertices(
    150,
    300,
    [cloudVertices],
    {
      isStatic: true,
      label: 'cloud',
      render: {
        fillStyle: 'rgba(0,0,0,0)',
        strokeStyle: '#397896',
        lineWidth: 5,
      },
    },
    true
  );
  Matter.Body.scale(cloud, 2.5, 1.5);

  // 월드에 바디 추가
  Matter.World.add(world, [
    ...walls,
    ball,
    star,
    horizontalPlatformForBall,
    horizontalPlatform,
    slope,
    horizontalPlatformForStar,
    cloud,
  ]);

  return [
    ...walls,
    ball,
    star,
    horizontalPlatformForBall,
    horizontalPlatform,
    slope,
    horizontalPlatformForStar,
    cloud,
  ];
};
