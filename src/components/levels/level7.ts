// src/levels/level4.ts
import Matter from 'matter-js';
import type { LevelFactory } from './index';

export const createLevel7: LevelFactory = (world) => {
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
  const ball = Matter.Bodies.circle(400, 180, 15, {
    render: { fillStyle: '#ef4444' },
    label: 'ball',
    frictionAir:  0.001,  
    collisionFilter: { category: 0x0001, mask: 0xFFFF },
  });
  // initialBallPositionRef.current = { x: 400, y: 180 };

  // 목표 생성
  const star = Matter.Bodies.trapezoid(400, 350, 20, 20, 1, {
    render: { fillStyle: '#fbbf24' },
    label: 'balloon',
    isStatic: true,
    collisionFilter: { category: 0x0001, mask: 0x0001 },
  });

  // 구조물 생성
  const topBar = Matter.Bodies.rectangle(400, 200, 150, 10, {
    isStatic: true,
    label: 'top_bar',
    render: { fillStyle: '#6b7280' },
    collisionFilter: { category: 0x0001, mask: 0xFFFF },
  });
  const verticalBar = Matter.Bodies.rectangle(400, 250, 10, 100, {
    isStatic: true,
    label: 'vertical_bar',
    render: { fillStyle: '#6b7280' },
    collisionFilter: { category: 0x0001, mask: 0xFFFF },
  });
  const redBox = Matter.Bodies.rectangle(400, 375, 30, 30, {
    isStatic: true,
    label: 'red_box',
    render: { fillStyle: '#ef4444' },
    collisionFilter: { category: 0x0001, mask: 0xFFFF },
  });

  // 초록 플랫폼 생성
  const leftUpGreenPlatform = Matter.Bodies.rectangle(200, 300, 60, 10, {
    isStatic: true,
    label: 'left_up_green_platform',
    render: { fillStyle: '#10b981' },
    collisionFilter: { category: 0x0001, mask: 0xFFFF },
  });
  const leftDownGreenPlatform = Matter.Bodies.rectangle(250, 500, 60, 10, {
    isStatic: true,
    label: 'left_down_green_platform',
    render: { fillStyle: '#10b981' },
    collisionFilter: { category: 0x0001, mask: 0xFFFF },
  });
  const rightUpGreenPlatform = Matter.Bodies.rectangle(550, 300, 60, 10, {
    isStatic: true,
    label: 'right_up_green_platform',
    render: { fillStyle: '#10b981' },
    collisionFilter: { category: 0x0001, mask: 0xFFFF },
  });
  const rightDownGreenPlatform = Matter.Bodies.rectangle(500, 500, 60, 10, {
    isStatic: true,
    label: 'right_down_green_platform',
    render: { fillStyle: '#10b981' },
    collisionFilter: { category: 0x0001, mask: 0xFFFF },
  });

  // 월드에 바디 추가
  Matter.World.add(world, [
    ...walls,
    ball,
    star,
    topBar,
    verticalBar,
    redBox,
    leftUpGreenPlatform,
    leftDownGreenPlatform,
    rightUpGreenPlatform,
    rightDownGreenPlatform,
  ]);

  return [
    ...walls,
    ball,
    star,
    topBar,
    verticalBar,
    redBox,
    leftUpGreenPlatform,
    leftDownGreenPlatform,
    rightUpGreenPlatform,
    rightDownGreenPlatform,
  ];
};
