// src/levels/level1.ts
import Matter from 'matter-js';
import type { LevelFactory } from './index';

export const createLevel1: LevelFactory = (world) => {
  // 기본 벽 옵션
  const wallOptions = {
    isStatic: true,
    label: 'wall',
    friction: 1,
    frictionStatic: 1,
    restitution: 0.2,
    collisionFilter: {
      category: 0x0001,
      mask: 0xFFFF,
    },
  };

  // 바닥 벽만 활성화 (필요 시 주석 해제)
  const walls = [
    Matter.Bodies.rectangle(400, 610, 810, 20, { ...wallOptions, label: 'wall_bottom' }),
  ];

  walls.forEach((wall) => {
    Matter.Body.setStatic(wall, true);
    wall.render.fillStyle = '#94a3b8';
  });

  // 공 생성
  const ball = Matter.Bodies.circle(200, 300, 15, {
    render: { fillStyle: '#ef4444' },
    label: 'ball',
    frictionAir:  0.001,  
    collisionFilter: {
      category: 0x0001,
      mask: 0xFFFF,
    },
  });

  // 별(스타) 생성
  const star = Matter.Bodies.trapezoid(600, 290, 20, 20, 1, {
    render: { fillStyle: '#fbbf24' },
    label: 'balloon',
    isStatic: true,
    collisionFilter: {
      category: 0x0001,
      mask: 0x0001,
    },
  });

  // 타워 구조물 생성
  const towers = [1, 2, 3, 4, 5].map((i) =>
    Matter.Bodies.rectangle(
      200 + 100 * (i - 1),
      400,
      50,
      200,
      {
        isStatic: true,
        label: `tower${i}`,
        collisionFilter: {category: 0x0002, mask: 0xFFFD,
        },
      }
    )
  );

  // 월드에 바디 추가
  Matter.World.add(world, [...towers, ...walls, ball, star]);

  return [...towers, ...walls, ball, star];
};
