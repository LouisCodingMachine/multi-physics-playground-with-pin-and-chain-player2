// src/levels/level18.ts
import Matter from 'matter-js';
import type { LevelFactory } from './index';

export const createLevel4: LevelFactory = (world) => {

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
      frictionAir:  0,  
      render: { fillStyle: '#ef4444' },
      collisionFilter: { category: 0x0001, mask: 0xFFFF },
      friction: 1,
    }
  );
  // 초기 위치 저장 (리스폰용)
  // initialBallPositionRef.current = { x: 100, y: 100 };
  // ballRef.current = ball;

  // 1) 기울어진 대각선 플랫폼 생성 (왼쪽 상단에서 아래쪽으로)
  const diagonal = Matter.Bodies.rectangle(
    150,          // X: 화면 왼쪽
    300,          // Y: 화면 상단
    500,          // 길이
    20,           // 두께
    {
      isStatic: true,
      label: 'diagonal_19',
      angle: Math.PI / 3, // 30도 기울기 (왼쪽이 위, 오른쪽이 아래)
      render: { fillStyle: '#6b7280' },
      collisionFilter: { category: 0x0001, mask: 0xFFFF },
      friction: 1,
    }
  );

  // 2) 오른쪽 아래 땅 생성
  const ground = Matter.Bodies.rectangle(
    450,   // X: 오른쪽
    580,   // Y: 아래
    380,   // 너비
    150,   // 두께
    {
      isStatic: true,
      label: 'ground_18',
      render: { fillStyle: '#6b7280' },
      collisionFilter: { category: 0x0001, mask: 0xFFFF },
      friction: 1,
    }
  );

  const ground2 = Matter.Bodies.rectangle(
    780,   // X: 오른쪽
    580,   // Y: 아래
    135,   // 너비
    150,   // 두께
    {
      isStatic: true,
      label: 'ground_18',
      render: { fillStyle: '#6b7280' },
      collisionFilter: { category: 0x0001, mask: 0xFFFF },
      friction: 0,
    }
  );

  // 3) 땅 위에 별 생성
  const star = Matter.Bodies.trapezoid(
    780,   // X: 땅과 동일
    495,   // Y: 땅 바로 위
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
  Matter.World.add(world, [...walls, ball, ground, ground2, diagonal, star]);

  // 반환
  return [...walls,ball, ground, ground2, diagonal, star];
};
