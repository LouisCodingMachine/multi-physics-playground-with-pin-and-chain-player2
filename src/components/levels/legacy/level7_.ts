// src/levels/level7.ts
import Matter from 'matter-js';
import type { LevelFactory } from './index';

export const createLevel7: LevelFactory = (world) => {
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
  const ball = Matter.Bodies.circle(100, 300, 15, {
    render: { fillStyle: '#ef4444' },
    label: 'ball',
    restitution: 0.3,
    friction: 0.05,
    frictionAir: 0.01,
    collisionFilter: { category: 0x0001, mask: 0xFFFF },
  });

  // 목표(별) 생성
  const star = Matter.Bodies.trapezoid(650, 520, 20, 20, 1, {
    render: { fillStyle: '#fbbf24' },
    label: 'balloon',
    isStatic: true,
    collisionFilter: { category: 0x0001, mask: 0x0001 },
  });

  // U자형 빨간 구조물 생성
  const leftVerticalWall = Matter.Bodies.rectangle(600, 335, 40, 450, {
    isStatic: true,
    label: 'left_red_wall',
    render: { fillStyle: '#ef4444' },
    collisionFilter: { category: 0x0001, mask: 0xFFFF },
  });
  const rightVerticalWall = Matter.Bodies.rectangle(700, 335, 40, 450, {
    isStatic: true,
    label: 'right_red_wall',
    render: { fillStyle: '#ef4444' },
    collisionFilter: { category: 0x0001, mask: 0xFFFF },
  });
  const bottomHorizontalWall = Matter.Bodies.rectangle(650, 550, 140, 30, {
    isStatic: true,
    label: 'bottom_red_wall',
    render: { fillStyle: '#ef4444' },
    collisionFilter: { category: 0x0001, mask: 0xFFFF },
  });

  // 월드에 바디 추가
  Matter.World.add(world, [
    ...walls,
    ball,
    star,
    leftVerticalWall,
    rightVerticalWall,
    bottomHorizontalWall,
  ]);

  // 반환
  return [
    ...walls,
    ball,
    star,
    leftVerticalWall,
    rightVerticalWall,
    bottomHorizontalWall,
  ];
};
