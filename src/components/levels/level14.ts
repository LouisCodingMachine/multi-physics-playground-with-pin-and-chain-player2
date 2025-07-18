// src/levels/level21.ts
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

  // 1) 왼쪽에 세로로 긴 직사각형 (탑 형태)
  const leftTower = Matter.Bodies.rectangle(
    80,   // X: 화면 왼쪽
    400,  // Y: 중간 높이
    80,   // 너비
    400,  // 높이
    {
      isStatic: true,
      label: 'leftTower_21',
      render: { fillStyle: '#6b7280' },
      collisionFilter: { category: 0x0001, mask: 0xFFFF },
    }
  );

  // 2) 왼쪽 타워 맨 위에 공 얹기
  const ballStartY = 200 - 15; // 타워 topY(200) - 공 반지름
  const ball = Matter.Bodies.circle(
    80,
    ballStartY,
    15,
    {
      label: 'ball',
      frictionAir:  0.001,  
      render: { fillStyle: '#ef4444' },
      collisionFilter: { category: 0x0001, mask: 0xFFFF },
    }
  );
  // initialBallPositionRef.current = { x: 80, y: ballStartY };
  // ballRef.current = ball;

  // 3) 중앙에 공중에 떠 있는 박스
  const floatingBox = Matter.Bodies.rectangle(
    500,  // 화면 중앙
    200,  // Y: 위쪽 위치
    200,  // 너비
    100,  // 높이
    {
      isStatic: true,
      label: 'floatingBox_21',
      render: { fillStyle: '#6b7280' },
      collisionFilter: { category: 0x0001, mask: 0xFFFF },
    }
  );

  // 4) 오른쪽 아래로 기울어진 대각선 플랫폼
  const diagonal = Matter.Bodies.rectangle(
    632,           // X: 오른쪽
    381,           // Y: 아래쪽 중간
    200,           // 길이
    20,            // 두께
    {
      isStatic: true,
      label: 'diagonal_21',
      angle: -Math.PI / 6, // -30도 (오른쪽 아래가 높음)
      render: { fillStyle: '#6b7280' },
      collisionFilter: { category: 0x0001, mask: 0xFFFF },
    }
  );

  // 5) 추가 공중 박스
  const floatingBox2 = Matter.Bodies.rectangle(
    764,
    332,
    100,
    20,
    {
      isStatic: true,
      label: 'floatingBox2',
      render: { fillStyle: '#6b7280' },
      collisionFilter: { category: 0x0001, mask: 0xFFFF },
    }
  );

  // 6) 오른쪽 위 별 생성
  const star = Matter.Bodies.trapezoid(
    764,
    315,
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

  // 월드에 바디 추가
  Matter.World.add(world, [...walls,
    leftTower,
    ball,
    floatingBox,
    diagonal,
    floatingBox2,
    star,
  ]);

  // 반환
  return [...walls,
    leftTower,
    ball,
    floatingBox,
    diagonal,
    floatingBox2,
    star,
  ];
};
