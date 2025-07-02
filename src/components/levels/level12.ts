// src/levels/level17.ts
import Matter from 'matter-js';
import type { LevelFactory } from './index';

export const createLevel12: LevelFactory = (world) => {

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

  // 1) 화면 상단에 긴 플랫폼 생성
  const ground = Matter.Bodies.rectangle(
    400,  // 캔버스 중간 X
    150,  // Y 위치 (위쪽)
    200,  // 전체 너비
    20,   // 두께
    {
      isStatic: true,
      label: 'ground_17',
      render: { fillStyle: '#6b7280' },
      collisionFilter: { category: 0x0001, mask: 0xFFFF },
    }
  );

  // 2) 공 생성 및 초기 위치 참조
  const ball = Matter.Bodies.circle(
    400,  // X 위치: 플랫폼 중앙
    130,  // Y 위치: 플랫폼 위
    15,   // 반지름
    {
      label: 'ball',
      frictionAir:  0.001,  
      render: { fillStyle: '#ef4444' },
      collisionFilter: { category: 0x0001, mask: 0xFFFF },
    }
  );
  // 초기 위치 저장
  // initialBallPositionRef.current = { x: 400, y: 130 };
  // ballRef.current = ball;

  // 3) 별 생성 (플랫폼 아래, 공 아래에 떠 있도록)
  const star = Matter.Bodies.trapezoid(
    400,  // X 위치: 공과 동일
    400,  // Y 위치: 플랫폼/공 아래
    20,   // 너비
    20,   // 높이
    1,    // 비율
    {
      isStatic: true,
      label: 'balloon',
      render: { fillStyle: '#fbbf24' },
      collisionFilter: { category: 0x0001, mask: 0x0001 },
    }
  );

  // 월드에 추가
  Matter.World.add(world, [...walls,ground, ball, star]);

  // 반환
  return [...walls,ground, ball, star];
};
