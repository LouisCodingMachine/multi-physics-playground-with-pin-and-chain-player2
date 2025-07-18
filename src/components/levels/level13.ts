// src/levels/level13.ts
import Matter from 'matter-js';
import type { LevelFactory } from './index';

export const createLevel13: LevelFactory = (world) => {
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

  // 1) 왼쪽 및 오른쪽 박스 생성
  const leftBox = Matter.Bodies.rectangle(60, 100, 80, 30, {
    isStatic: true,
    label: 'left_box',
    render: { fillStyle: '#10b981' },
    collisionFilter: { category: 0x0002, mask: 0xFFFD },
  });
  const rightBox = Matter.Bodies.rectangle(700, 500, 80, 30, {
    isStatic: true,
    label: 'right_box',
    render: { fillStyle: '#10b981' },
    collisionFilter: { category: 0x0002, mask: 0xFFFD },
  });

  // 2) 공 생성 (왼쪽 박스 위)
  const ball = Matter.Bodies.circle(60, 80, 15, {
    label: 'ball',
    frictionAir:  0.001,  
    render: { fillStyle: '#ef4444' },
    collisionFilter: { category: 0x0001, mask: 0xFFFF },
  });

  // 3) 목표(별) 생성 (오른쪽 박스 위)
  const star = Matter.Bodies.trapezoid(700, 475, 20, 20, 1, {
    isStatic: true,
    label: 'balloon',
    render: { fillStyle: '#fbbf24' },
    collisionFilter: { category: 0x0001, mask: 0x0001 },
  });

  // 월드에 바디 추가
  Matter.World.add(world, [
    ...walls,
    leftBox,
    rightBox,
    ball,
    star,
  ]);

  // 반환
  return [
    ...walls,
    leftBox,
    rightBox,
    ball,
    star,
  ];
};
