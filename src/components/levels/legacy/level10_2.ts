// src/levels/level10.ts
import Matter from 'matter-js';
import type { LevelFactory } from './index';

export const createLevel10: LevelFactory = (world) => {
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
  const ball = Matter.Bodies.circle(150, 500, 15, {
    render: { fillStyle: '#ef4444' },
    label: 'ball',
    restitution: 0.3,
    friction: 0.05,
    frictionAir: 0.01,
    collisionFilter: { category: 0x0001, mask: 0xFFFF },
  });

  // 수평 플랫폼 생성
  const horizontalPlatform = Matter.Bodies.rectangle(150, 550, 150, 100, {
    isStatic: true,
    label: 'horizontal_platform',
    render: { fillStyle: '#6b7280' },
    collisionFilter: { category: 0x0001, mask: 0xFFFF },
  });

  // 목표(별) 생성
  const star = Matter.Bodies.trapezoid(600, 130, 20, 20, 1, {
    render: { fillStyle: '#fbbf24' },
    label: 'balloon',
    isStatic: true,
    collisionFilter: { category: 0x0001, mask: 0x0001 },
  });

  // 프레임 생성
  const frameTop = Matter.Bodies.rectangle(600, 80, 100, 25, {
    isStatic: true,
    label: 'frame_top',
    render: { fillStyle: '#94a3b8' },
    collisionFilter: { category: 0x0001, mask: 0xFFFF },
  });
  const frameLeft = Matter.Bodies.rectangle(550, 110, 25, 85, {
    isStatic: true,
    label: 'frame_left',
    render: { fillStyle: '#94a3b8' },
    collisionFilter: { category: 0x0001, mask: 0xFFFF },
  });
  const frameRight = Matter.Bodies.rectangle(650, 110, 25, 85, {
    isStatic: true,
    label: 'frame_right',
    render: { fillStyle: '#94a3b8' },
    collisionFilter: { category: 0x0001, mask: 0xFFFF },
  });

  // 월드에 바디 추가
  Matter.World.add(world, [
    ...walls,
    ball,
    horizontalPlatform,
    star,
    frameTop,
    frameLeft,
    frameRight,
  ]);

  // 반환
  return [
    ...walls,
    ball,
    horizontalPlatform,
    star,
    frameTop,
    frameLeft,
    frameRight,
  ];
};
