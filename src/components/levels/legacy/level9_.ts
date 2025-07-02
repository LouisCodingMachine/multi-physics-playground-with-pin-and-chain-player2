// src/levels/level9.ts
import Matter from 'matter-js';
import type { LevelFactory } from './index';

export const createLevel9: LevelFactory = (world) => {
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
  const ball = Matter.Bodies.circle(500, 250, 15, {
    render: { fillStyle: '#ef4444' },
    label: 'ball',
    restitution: 0.3,
    friction: 0.05,
    frictionAir: 0.01,
    collisionFilter: { category: 0x0001, mask: 0xFFFF },
  });
  
  // 목표(별) 생성
  const star = Matter.Bodies.trapezoid(150, 310, 20, 20, 1, {
    render: { fillStyle: '#fbbf24' },
    label: 'balloon',
    isStatic: true,
    collisionFilter: { category: 0x0001, mask: 0x0001 },
  });

  // 빨간 플랫폼 생성
  const redPlatform = Matter.Bodies.rectangle(120, 340, 250, 30, {
    isStatic: true,
    label: 'red_platform',
    render: { fillStyle: '#ef4444' },
    collisionFilter: { category: 0x0001, mask: 0xFFFF },
  });

  // 초록 경사면 생성
  const greenRamp = Matter.Bodies.trapezoid(520, 310, 220, 100, 2, {
    isStatic: true,
    label: 'green_ramp',
    render: { fillStyle: '#10b981' },
    collisionFilter: { category: 0x0001, mask: 0xFFFF },
  });

  // 중앙 파란 장애물 생성
  const centralUp = Matter.Bodies.rectangle(400, 170, 90, 350, {
    isStatic: true,
    label: 'central_up_obstacle',
    render: { fillStyle: '#3b82f6' },
    collisionFilter: { category: 0x0001, mask: 0xFFFF },
  });
  const centralDown = Matter.Bodies.rectangle(400, 550, 90, 100, {
    isStatic: true,
    label: 'central_down_obstacle',
    render: { fillStyle: '#3b82f6' },
    collisionFilter: { category: 0x0001, mask: 0xFFFF },
  });

  // 월드에 바디 추가
  Matter.World.add(world, [
    ...walls,
    ball,
    star,
    redPlatform,
    greenRamp,
    centralUp,
    centralDown,
  ]);

  // 반환
  return [
    ...walls,
    ball,
    star,
    redPlatform,
    greenRamp,
    centralUp,
    centralDown,
  ];
};
