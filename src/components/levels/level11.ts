// src/levels/level16.ts
import Matter from 'matter-js';
import type { LevelFactory } from './index';

export const createLevel11: LevelFactory = (world) => {

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

  // 1) 긴 바닥 플랫폼 생성
  const ground = Matter.Bodies.rectangle(
    300,
    590,
    600,
    80,
    {
      isStatic: true,
      label: 'ground_long',
      render: { fillStyle: '#6b7280' },
      collisionFilter: { category: 0x0001, mask: 0xFFFF },
    }
  );

  // 2) 대각선 플랫폼 생성 (-45도 기울기)
  const diagonal = Matter.Bodies.rectangle(
    200,
    250,
    200,
    20,
    {
      isStatic: true,
      label: 'diagonal_platform',
      angle: -Math.PI / 4,
      render: { fillStyle: '#6b7280' },
      collisionFilter: { category: 0x0001, mask: 0xFFFF },
    }
  );

  // 3) 바구니 모양 플랫폼 생성 (U자형)
  const basketBottom = Matter.Bodies.rectangle(
    500,
    450,
    200,
    20,
    {
      isStatic: true,
      label: 'basket_bottom',
      render: { fillStyle: '#6b7280' },
      collisionFilter: { category: 0x0001, mask: 0xFFFF },
    }
  );
  const basketLeft = Matter.Bodies.rectangle(
    400,
    410,
    20,
    80,
    {
      isStatic: true,
      label: 'basket_left',
      render: { fillStyle: '#6b7280' },
      collisionFilter: { category: 0x0001, mask: 0xFFFF },
    }
  );
  const basketRight = Matter.Bodies.rectangle(
    600,
    410,
    20,
    80,
    {
      isStatic: true,
      label: 'basket_right',
      render: { fillStyle: '#6b7280' },
      collisionFilter: { category: 0x0001, mask: 0xFFFF },
    }
  );

  // 4) 별(목표) 생성 (바구니 내부)
  const star = Matter.Bodies.trapezoid(
    500,
    430,
    20,
    20,
    1,
    {
      isStatic: true,
      label: 'balloon',
      render: { fillStyle: '#fbbf24' },
      collisionFilter: { category: 0x0001, mask: 0x0001 },
    }
  );

  // 5) 공 생성 (시작 위치)
  const ball = Matter.Bodies.circle(230, 550, 15, {
    label: 'ball',
    frictionAir:  0.001,  
    render: { fillStyle: '#ef4444' },
    collisionFilter: { category: 0x0001, mask: 0xFFFF },
  });

  // ball 초기 위치 참조
  // initialBallPositionRef.current = { x: 230, y: 550 };
  // ballRef.current = ball;

  // 6) 월드에 바디 추가
  Matter.World.add(world, [
    ...walls,
    ground,
    diagonal,
    basketBottom,
    basketLeft,
    basketRight,
    star,
    ball,
  ]);

  return [
    ...walls,
    ground,
    diagonal,
    basketBottom,
    basketLeft,
    basketRight,
    star,
    ball,
  ];
};
