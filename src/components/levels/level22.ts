// src/levels/level22.ts
import Matter from 'matter-js';
import type { LevelFactory } from './index';

export const createLevel22: LevelFactory = (world) => {
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
    400, 180, 15,
    {
      label: 'ball',
      restitution: 0.3,
      friction: 0.05,
      frictionAir: 0.01,
      render: { fillStyle: '#ef4444' },
      collisionFilter: { category: 0x0001, mask: 0xFFFF },
    }
  );

  // 2) 별 생성 (고정)
  const star = Matter.Bodies.trapezoid(
    400, 350, 20, 20, 1,
    {
      isStatic: true,
      label: 'balloon',
      render: { fillStyle: '#fbbf24' },
      collisionFilter: { category: 0x0001, mask: 0x0001 },
    }
  );

  // 3) 레벨 오브젝트들
  // (1) 상단 가로바
  const topBar = Matter.Bodies.rectangle(
    400, 200, 150, 10,
    {
      isStatic: true,
      label: 'top_bar',
      render: { fillStyle: '#6b7280' },
      collisionFilter: { category: 0x0001, mask: 0xFFFF },
    }
  );
  // (2) 세로바
  const verticalBar = Matter.Bodies.rectangle(
    400, 250, 10, 100,
    {
      isStatic: true,
      label: 'vertical_bar',
      render: { fillStyle: '#6b7280' },
      collisionFilter: { category: 0x0001, mask: 0xFFFF },
    }
  );
  // (3) 빨간 박스
  const redBox = Matter.Bodies.rectangle(
    400, 375, 30, 30,
    {
      isStatic: true,
      label: 'red_box',
      render: { fillStyle: '#ef4444' },
      collisionFilter: { category: 0x0001, mask: 0xFFFF },
    }
  );
  // (4) 왼쪽 위 초록 플랫폼
  const leftUpGreenPlatform = Matter.Bodies.rectangle(
    200, 300, 60, 30,
    {
      isStatic: true,
      label: 'left_up_green_platform',
      render: { fillStyle: '#10b981' },
      collisionFilter: { category: 0x0001, mask: 0xFFFF },
    }
  );
  // (5) 왼쪽 아래 초록 플랫폼
  const leftDownGreenPlatform = Matter.Bodies.rectangle(
    250, 500, 60, 30,
    {
      isStatic: true,
      label: 'left_down_green_platform',
      render: { fillStyle: '#10b981' },
      collisionFilter: { category: 0x0001, mask: 0xFFFF },
    }
  );
  // (6) 오른쪽 위 초록 플랫폼
  const rightUpGreenPlatform = Matter.Bodies.rectangle(
    550, 300, 60, 30,
    {
      isStatic: true,
      label: 'right_up_green_platform',
      render: { fillStyle: '#10b981' },
      collisionFilter: { category: 0x0001, mask: 0xFFFF },
    }
  );
  // (7) 오른쪽 아래 초록 플랫폼
  const rightDownGreenPlatform = Matter.Bodies.rectangle(
    500, 500, 60, 30,
    {
      isStatic: true,
      label: 'right_down_green_platform',
      render: { fillStyle: '#10b981' },
      collisionFilter: { category: 0x0001, mask: 0xFFFF },
    }
  );

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

  // 반환
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