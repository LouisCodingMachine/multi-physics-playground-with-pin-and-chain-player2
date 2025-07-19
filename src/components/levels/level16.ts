// src/levels/level18.ts
import Matter from 'matter-js';
import type { LevelFactory } from './index';

export const createLevel16: LevelFactory = (world) => {

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

  // 1) 왼쪽 위에 떠 있는 공 생성
  const ball = Matter.Bodies.circle(
    100,   // X: 왼쪽
    100,   // Y: 위쪽
    15,    // 반지름
    {
      label: 'ball',
      frictionAir:  0.001,  
      render: { fillStyle: '#ef4444' },
      collisionFilter: { category: 0x0001, mask: 0xFFFF },
    }
  );
  // 초기 위치 저장 (리스폰용)
  // initialBallPositionRef.current = { x: 100, y: 100 };
  // ballRef.current = ball;

  const ballGround = Matter.Bodies.rectangle(100, 200, 50, 20, {
      isStatic: true,
      label: 'ballGround_18_reject_pin',
      render: { fillStyle: '#ef4444' },
      collisionFilter: { category: 0x0001, mask: 0xFFFF },
    });
  

  // 2) 오른쪽 아래 땅 생성
  const ground = Matter.Bodies.rectangle(
    650,   // X: 오른쪽
    580,   // Y: 아래
    150,   // 너비
    150,   // 두께
    {
      isStatic: true,
      label: 'ground_18',
      render: { fillStyle: '#6b7280' },
      collisionFilter: { category: 0x0002, mask: 0xFFFD },
    }
  );

  // 3) 땅 위에 별 생성
  const star = Matter.Bodies.trapezoid(
    650,   // X: 땅과 동일
    500,   // Y: 땅 바로 위
    20,    // 너비
    20,    // 높이
    1,     // 비율
    {
      isStatic: true,
      label: 'balloon',
      render: { fillStyle: '#fbbf24' },
      collisionFilter: { category: 0x0001, mask: 0x0001 },
    }
  );

  // 월드에 바디 추가
  Matter.World.add(world, [...walls,ball, ballGround, ground, star]);

  // 반환
  return [...walls,ball, ballGround, ground, star];
};
