import Matter from 'matter-js';
import type { LevelFactory } from './index';

export const createLevel2: LevelFactory = (world) => {
  // 기본 벽 옵션
  const wallOptions = {
    isStatic: true,
    label: 'wall',
    collisionFilter: {
      category: 0x0001,
      mask: 0xFFFF,
    },
  };

  // 바닥 벽 생성
  const walls = [
    Matter.Bodies.rectangle(400, 610, 810, 20, { ...wallOptions, label: 'wall_bottom' }),
  ];

  walls.forEach((wall) => {
    Matter.Body.setStatic(wall, true);
    wall.render.fillStyle = '#94a3b8';
  });

  // 공 생성
  const ball = Matter.Bodies.circle(200, 500, 15, {
    render: { fillStyle: '#ef4444' },
    label: 'ball',
    frictionAir:  0.001,  
    collisionFilter: {
      category: 0x0001,
      mask: 0xFFFF,
    },
  });

  // 수평 플랫폼 생성
  const horizontalPlatform = Matter.Bodies.rectangle(400, 550, 700, 200, {
    isStatic: true,
    label: 'horizontal_platform',
    render: { fillStyle: '#6b7280' },
    collisionFilter: {category: 0x0002, mask: 0xFFFD,
    },
  });

  // 별(스타) 생성
  const star = Matter.Bodies.trapezoid(650, 430, 20, 20, 1, {
    render: { fillStyle: '#fbbf24' },
    label: 'balloon',
    isStatic: true,
    collisionFilter: {
      category: 0x0001,
      mask: 0x0001,
    },
  });

  // 월드에 바디 추가
  Matter.World.add(world, [...walls, ball, star, horizontalPlatform]);

  return [...walls, ball, star, horizontalPlatform];
};
