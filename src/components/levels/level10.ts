// src/levels/level15.ts
import Matter from 'matter-js';
import type { LevelFactory } from './index';

export const createLevel10: LevelFactory = (world) => {
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

  // 1) 첫 번째 상자
  const floor1 = Matter.Bodies.rectangle(230, 500, 120, 200, {
    isStatic: true,
    label: 'floor1',
    render: { fillStyle: '#10b981' },
    collisionFilter: { category: 0x0001, mask: 0xFFFF },
  });

  // 2) 두 번째 상자
  const floor2 = Matter.Bodies.rectangle(550, 550, 120, 200, {
    isStatic: true,
    label: 'floor2',
    render: { fillStyle: '#10b981' },
    collisionFilter: { category: 0x0001, mask: 0xFFFF },
  });

  // 3) 세 번째 상자
  const floor3 = Matter.Bodies.rectangle(690, 550, 160, 300, {
    isStatic: true,
    label: 'floor3',
    render: { fillStyle: '#10b981' },
    collisionFilter: { category: 0x0001, mask: 0xFFFF },
  });

  // 3-2) 공 튀김 방지 상자
  const safeBox = Matter.Bodies.rectangle(790, 380, 40, 450, {
    isStatic: true,
    label: 'safe_box',
    render: { fillStyle: '#10b981' },
    collisionFilter: { category: 0x0001, mask: 0xFFFF },
  });

  // 4) 힌지 달린 상자
  const hingeBox = Matter.Bodies.rectangle(230, 100, 150, 100, {
    isStatic: true,
    label: 'hingeBox',
    render: { fillStyle: '#10b981' },
    collisionFilter: { category: 0x0001, mask: 0xFFFF },
  });

  // 5) 힌지 축 생성
  const radius = 10;
  const nail15_0 = Matter.Bodies.circle(
    hingeBox.position.x,
    hingeBox.position.y,
    radius,
    {
      isStatic: true,
      label: 'nail15_0',
      collisionFilter: { group: -1, category: 0x0002, mask: 0x0000 },
      render: {
        fillStyle: 'rgba(0,0,0,0)',
        strokeStyle: '#fbbf24',
        lineWidth: 3,
      },
    }
  );

  // 6) 제약 조건 설정
  const pivot15 = Matter.Constraint.create({
    bodyA: hingeBox,
    pointA: { x: 0, y: 0 },
    bodyB: nail15_0,
    pointB: { x: 0, y: 0 },
    length: 0,
    stiffness: 1,
    render: { visible: false },
  });

  // 7) 공 및 별 생성
  const ball = Matter.Bodies.circle(230, 400, 15, {
    label: 'ball',
    frictionAir:  0.001,  
    render: { fillStyle: '#ef4444' },
    collisionFilter: { category: 0x0001, mask: 0xFFFF },
  });

  const star = Matter.Bodies.trapezoid(700,390, 20, 20, 1, {
    isStatic: true,
    label: 'balloon',
    render: { fillStyle: '#fbbf24' },
    collisionFilter: { category: 0x0001, mask: 0x0001 },
  });

  // 8) 월드에 바디 추가
  Matter.World.add(world, [
    ...walls,
    floor1,
    floor2,
    floor3,
    safeBox,
    hingeBox,
    nail15_0,
    pivot15,
    ball,
    star,
  ]);

  return [
    ...walls,
    floor1,
    floor2,
    floor3,
    safeBox,
    hingeBox,
    nail15_0,
    pivot15,
    ball,
    star,
  ];
};
