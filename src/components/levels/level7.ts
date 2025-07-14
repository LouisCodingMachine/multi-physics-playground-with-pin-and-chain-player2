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
  const ball = Matter.Bodies.circle(400, 140, 15, {
    render: { fillStyle: '#ef4444' },
    label: 'ball',
    restitution: 1,
    friction: 0,
    frictionAir: 0.0145,
    collisionFilter: { category: 0x0001, mask: 0xFFFF },
  });

  // 목표 생성
  const star = Matter.Bodies.trapezoid(400, 350, 20, 20, 1, {
    render: { fillStyle: '#fbbf24' },
    label: 'balloon',
    isStatic: true,
    collisionFilter: { category: 0x0001, mask: 0x0001 },
  });

  // 구조물 생성
  const topBar = Matter.Bodies.rectangle(400, 150, 50, 10, {
    isStatic: true,
    label: 'top_bar',
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
  const leftUpGreenPlatform = Matter.Bodies.rectangle(80, 370, 150, 10, {
    isStatic: true,
    label: 'left_up_green_platform',
    render: { fillStyle: '#6b7280' },
    collisionFilter: { category: 0x0001, mask: 0xFFFF },
  });
  const leftDownGreenPlatform = Matter.Bodies.rectangle(300, 500, 60, 10, {
    isStatic: true,
    label: 'left_down_green_platform',
    render: { fillStyle: '#6b7280' },
    collisionFilter: { category: 0x0001, mask: 0xFFFF },
  });
  const rightUpGreenPlatform = Matter.Bodies.rectangle(720, 370, 150, 10, {
    isStatic: true,
    label: 'right_up_green_platform',
    render: { fillStyle: '#6b7280' },
    collisionFilter: { category: 0x0001, mask: 0xFFFF },
  });
  const rightDownGreenPlatform = Matter.Bodies.rectangle(500, 500, 60, 10, {
    isStatic: true,
    label: 'right_down_green_platform',
    render: { fillStyle: '#6b7280' },
    collisionFilter: { category: 0x0001, mask: 0xFFFF },
  });

  // --- 여기서 초승달 추가 ---
  // 밝은 달 원
  const moon = Matter.Bodies.circle(750, 50, 30, {
    isStatic: true,
    label: 'moon',
    render: { fillStyle: '#fbbf24' },
    collisionFilter: { category: 0x0001, mask: 0x0000 },
  });
  // 배경색 원으로 일부를 가려서 초승달 모양 연출
  const moonMask = Matter.Bodies.circle(765, 40, 30, {
    isStatic: true,
    label: 'moon_mask',
    render: { fillStyle: '#1e293b' },
    collisionFilter: { category: 0x0001, mask: 0x0000 },
  });

  // --- 대각선 경사로 추가 ---
  // rightUpGreenPlatform(550,300)에서 topBar(400,200)로 이어지는 경사로
  const slopeLength = Math.hypot(100, 0);
  const slopeAngle = Math.atan2(200 - 300, 400 - 550);
  const slopeMidX = (700 + 450) / 2;
  const slopeMidY = (270 + 280) / 2;
  const diagonalRamp = Matter.Bodies.rectangle(
    slopeMidX,
    slopeMidY,
    slopeLength,
    10,
    {
      isStatic: true,
      label: 'diagonal_ramp',
      angle: slopeAngle,
      render: { fillStyle: '#6b7280' },
      collisionFilter: { category: 0x0001, mask: 0xFFFF },
    }
  );


  // --- 대각선 경사로 추가 ---
  // rightUpGreenPlatform(550,300)에서 topBar(400,200)로 이어지는 경사로
  const slopeLength2 = Math.hypot(100, 0);
  const slopeAngle2 = -Math.atan2(200 - 300, 400 - 550);
  const slopeMidX2 = (450) / 2;
  const slopeMidY2 = (270 + 280) / 2;
  const diagonalRamp2 = Matter.Bodies.rectangle(
    slopeMidX2,
    slopeMidY2,
    slopeLength2,
    10,
    {
      isStatic: true,
      label: 'diagonal_ramp',
      angle: slopeAngle2,
      render: { fillStyle: '#6b7280' },
      collisionFilter: { category: 0x0001, mask: 0xFFFF },
    }
  );


  // 월드에 바디 추가
  Matter.World.add(world, [
    ...walls,
    ball,
    star,
    topBar,
    redBox,
    leftUpGreenPlatform,
    leftDownGreenPlatform,
    rightUpGreenPlatform,
    rightDownGreenPlatform,
    moon,
    moonMask,
    diagonalRamp,
    diagonalRamp2,
  ]);

  return [
    ...walls,
    ball,
    star,
    topBar,
    redBox,
    leftUpGreenPlatform,
    leftDownGreenPlatform,
    rightUpGreenPlatform,
    rightDownGreenPlatform,
    moon,
    moonMask,
    diagonalRamp,
    diagonalRamp2,
  ];
};