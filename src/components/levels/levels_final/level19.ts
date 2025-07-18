// src/levels/level24.ts
import Matter from 'matter-js';
import type { LevelFactory } from './index';

export const createLevel19: LevelFactory = (world) => {
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

  // 1) 곡선형 '무지개' 플랫폼 생성
  const rainbowVertices = Array.from({ length: 21 }, (_, i) => {
    const theta = Math.PI + (i / 20) * Math.PI; // π ~ 2π
    return {
      x: 400 + 150 * Math.cos(theta),
      y: 400 + 150 * Math.sin(theta),
    };
  });
  const rainbow = Matter.Bodies.fromVertices(
    300, 150,
    [rainbowVertices],
    {
      isStatic: true,
      label: 'rainbow_24',
      render: {
        fillStyle: '#fbbf24',
        strokeStyle: '#f59e0b',
        lineWidth: 4,
      },
      collisionFilter: { category: 0x0001, mask: 0xFFFF },
    },
    true
  );

  // 2) 공 생성 및 초기 위치 저장
  const BallX = 180;
  const BallY = 100;  // 필요에 따라 수정
  const ball = Matter.Bodies.circle(
    BallX,
    BallY,
    15,
    {
      label: 'ball',
      frictionAir: 0,
      restitution: 0.8,    // 튕김 극대화
      friction: 0,
      render: { fillStyle: '#ef4444' },
      collisionFilter: { category: 0x0001, mask: 0xFFFF },
    }
  );

  // 3) 아래 왼쪽 박스 생성
  const leftBox = Matter.Bodies.rectangle(
    200, 550,
    150, 200,
    {
      isStatic: true,
      label: 'leftBox_24',
      render: { fillStyle: '#6b7280' },
      collisionFilter: { category: 0x0001, mask: 0xFFFF },
    }
  );

  // 4) 아래 오른쪽 박스 및 별 생성
  const rightBox = Matter.Bodies.rectangle(
    600, 550,
    150, 300,
    {
      isStatic: true,
      label: 'rightBox_24',
      render: { fillStyle: '#6b7280' },
      collisionFilter: { category: 0x0001, mask: 0xFFFF },
    }
  );
  const star = Matter.Bodies.trapezoid(
    600, 390, 20, 20, 1,
    {
      isStatic: true,
      label: 'balloon',
      render: { fillStyle: '#fbbf24' },
      collisionFilter: { category: 0x0001, mask: 0x0001 },
    }
  );


  // 6) 핀 위를 지나는 길쭉한 판자 생성 (길이 200, 두께 10, -45° 기울기)
  const plank = Matter.Bodies.rectangle(
  95, 420,   // 판자의 중심 위치
    150, 10,    // width, height
    {
      isStatic: true,
      angle: Math.PI / 4,    // -45도
      label: 'plank_left_24',
      render: { fillStyle: '#6b7280' },
      collisionFilter: { category: 0x0001, mask: 0xFFFF },
    }
  );

  // 7) 월드에 모든 바디 추가
  Matter.World.add(world, [
    ...walls,
    rainbow,
    ball,
    leftBox,
    rightBox,
    star,
    plank,
  ]);

  return [
    ...walls,
    rainbow,
    ball,
    leftBox,
    rightBox,
    star,
    plank,
  ];
};
