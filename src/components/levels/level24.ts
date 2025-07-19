// src/levels/level24.ts
import Matter from 'matter-js';
import type { LevelFactory } from './index';

export const createLevel24: LevelFactory = (world) => {
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

  // 1) 공 생성
  const ball = Matter.Bodies.circle(
    100, 50, 15,
    {
      label: 'ball',
      restitution: 0.3,
      friction: 0.05,
      frictionAir: 0.01,
      render: { fillStyle: '#ef4444' },
      collisionFilter: { category: 0x0001, mask: 0xFFFF },
    }
  );

  // 2) 별 생성
  const star = Matter.Bodies.trapezoid(
    650, 520, 20, 20, 1,
    {
      isStatic: true,
      label: 'balloon',
      render: { fillStyle: '#fbbf24' },
      collisionFilter: { category: 0x0001, mask: 0x0001 },
    }
  );

  const leftPlatform = Matter.Bodies.rectangle(
      100, 120, 60, 30,
      {
        isStatic: true,
        label: 'right_down_green_platform',
        render: { fillStyle: '#10b981' },
        collisionFilter: { category: 0x0001, mask: 0xFFFF },
      }
    );

  const middlePlatform = Matter.Bodies.rectangle(
    350, 150, 60, 30,
    {
      isStatic: true,
      label: 'right_down_green_platform',
      render: { fillStyle: '#10b981' },
      collisionFilter: { category: 0x0001, mask: 0xFFFF },
    }
  );

  // 3) 빨간 벽들
  // (1) 왼쪽 세로 벽
  const leftRedWall = Matter.Bodies.rectangle(
    600, 335, 40, 450,
    {
      isStatic: true,
      label: 'left_red_wall',
      render: { fillStyle: '#10b981' },
      collisionFilter: { category: 0x0001, mask: 0xFFFF },
    }
  );
  // (2) 오른쪽 세로 벽
  const rightRedWall = Matter.Bodies.rectangle(
    700, 335, 40, 450,
    {
      isStatic: true,
      label: 'right_red_wall',
      render: { fillStyle: '#10b981' },
      collisionFilter: { category: 0x0001, mask: 0xFFFF },
    }
  );
  // (3) 하단 가로 벽
  const bottomRedWall = Matter.Bodies.rectangle(
    650, 550, 140, 30,
    {
      isStatic: true,
      label: 'bottom_red_wall',
      render: { fillStyle: '#10b981' },
      collisionFilter: { category: 0x0001, mask: 0xFFFF },
    }
  );

  // 월드에 바디 추가
  Matter.World.add(world, [
    ...walls,
    ball,
    star,
    leftRedWall,
    rightRedWall,
    bottomRedWall,
    leftPlatform,
    middlePlatform,
  ]);

  // 반환
  return [
    ...walls,
    ball,
    star,
    leftRedWall,
    rightRedWall,
    bottomRedWall,
    leftPlatform,
    middlePlatform,
  ];
};