// src/levels/level19.ts
import Matter from 'matter-js';
import type { LevelFactory } from './index';

export const createLevel14: LevelFactory = (world) => {

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

  // 1) 기울어진 대각선 플랫폼 생성 (왼쪽 상단에서 아래쪽으로)
  const diagonal = Matter.Bodies.rectangle(
    100,          // X: 화면 왼쪽
    100,          // Y: 화면 상단
    100,          // 길이
    20,           // 두께
    {
      isStatic: true,
      label: 'diagonal_19',
      angle: Math.PI / 6, // 30도 기울기 (왼쪽이 위, 오른쪽이 아래)
      render: { fillStyle: '#6b7280' },
      collisionFilter: { category: 0x0001, mask: 0xFFFF },
    }
  );

  // 2) 공 생성 및 초기 위치 설정
  const ball = Matter.Bodies.circle(
    100,  // X: 플랫폼과 동일
    80,   // Y: 플랫폼보다 약간 위
    15,   // 반지름
    {
      label: 'ball',
      frictionAir:  0.001,  
      render: { fillStyle: '#ef4444' },
      collisionFilter: { category: 0x0001, mask: 0xFFFF },
    }
  );
  // initialBallPositionRef.current = { x: 100, y: 80 };
  // ballRef.current = ball;

  // 3) 상단 박스 생성
  const boxTop = Matter.Bodies.rectangle(
    400,  // 화면 중앙
    200,  // Y: 위쪽 박스 위치
    200,  // 너비
    20,   // 두께
    {
      isStatic: true,
      label: 'box_top_19',
      render: { fillStyle: '#6b7280' },
      collisionFilter: { category: 0x0001, mask: 0xFFFF },
    }
  );

  // 4) 하단 박스 생성
  const boxBottom = Matter.Bodies.rectangle(
    400,  // 화면 중앙
    350,  // Y: 하단 박스 위치
    200,
    20,
    {
      isStatic: true,
      label: 'box_bottom_19',
      render: { fillStyle: '#6b7280' },
      collisionFilter: { category: 0x0001, mask: 0xFFFF },
    }
  );

  // 5) 별 생성 (두 박스 사이 오른쪽)
  const star = Matter.Bodies.trapezoid(
    600,              // 화면 오른쪽
    (200 + 350) / 2,  // Y: 중간 지점 = 275
    20,               // 너비
    20,               // 높이
    1,                // 비율
    {
      isStatic: true,
      label: 'balloon',
      render: { fillStyle: '#fbbf24' },
      collisionFilter: { category: 0x0001, mask: 0x0001 },
    }
  );

  // 6) 월드에 바디 추가
  Matter.World.add(world, [...walls,diagonal, ball, boxTop, boxBottom, star]);

  // 반환 (Constraint 제외)
  return [...walls,diagonal, ball, boxTop, boxBottom, star];
};
