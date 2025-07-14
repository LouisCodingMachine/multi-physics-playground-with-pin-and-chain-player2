// src/levels/level3.ts
import Matter from 'matter-js';
import type { LevelFactory } from './index';

// 충돌 카테고리 비트 정의
const BALL_CATEGORY      = 0x0001; // 공
const PLATFORM_CATEGORY  = 0x0002; // 벽·플랫폼
const CLOUD_CATEGORY     = 0x0004; // 구름
const DRAWN_CATEGORY     = 0x0008; // 내가 그린 도형

export const createLevel3: LevelFactory = (world) => {
  // 1) 바닥 벽 생성 (오직 공과만 충돌)
  const wallOptions = {
    isStatic: true,
    label: 'wall',
    collisionFilter: {
      category: PLATFORM_CATEGORY,
      mask:     BALL_CATEGORY,
    },
  };
  const walls = [
    Matter.Bodies.rectangle(400, 610, 810, 20, {
      ...wallOptions,
      label: 'wall_bottom',
    }),
    // 필요하다면 상/좌/우 벽도 같은 옵션으로 추가
  ];
  walls.forEach(wall => {
    Matter.Body.setStatic(wall, true);
    wall.render.fillStyle = '#94a3b8';
  });

  // 2) 공 생성 (모든 플랫폼·구름·내도형과 충돌)
  const ball = Matter.Bodies.circle(150, 460, 15, {
    label: 'ball',
    render: { fillStyle: '#ef4444' },
    frictionAir: 0.001,
    collisionFilter: {
      category: BALL_CATEGORY,
      mask:     PLATFORM_CATEGORY | CLOUD_CATEGORY | DRAWN_CATEGORY,
    },
  });

  // 3) 목표(별) 생성 (오직 공과만 충돌)
  const star = Matter.Bodies.trapezoid(730, 465, 20, 20, 1, {
    isStatic: true,
    label: 'balloon',
    render: { fillStyle: '#fbbf24' },
    collisionFilter: {
      category: PLATFORM_CATEGORY,
      mask:     BALL_CATEGORY,
    },
  });

  // 4) 공 출발용 수평 플랫폼 (오직 공과만 충돌)
  const horizontalPlatformForBall = Matter.Bodies.rectangle(150, 500, 30, 30, {
    isStatic: true,
    label: 'horizontalPlatformForBall',
    render: { fillStyle: '#6b7280' },
    collisionFilter: {
      category: PLATFORM_CATEGORY,
      mask:     BALL_CATEGORY,
    },
  });

  // 5) 중간 플랫폼 (오직 공과만 충돌)
  const horizontalPlatform = Matter.Bodies.rectangle(500, 565, 500, 100, {
    isStatic: true,
    label: 'horizontal_platform',
    render: { fillStyle: '#6b7280' },
    collisionFilter: {
      category: PLATFORM_CATEGORY,
      mask:     BALL_CATEGORY,
    },
  });

  // 6) 경사로 (오직 공과만 충돌)
  const slope = Matter.Bodies.rectangle(615, 498, 200, 5, {
    isStatic: true,
    label: 'slope',
    angle: -Math.PI / 15,
    render: { fillStyle: '#6c757d' },
    collisionFilter: {
      category: PLATFORM_CATEGORY,
      mask:     BALL_CATEGORY,
    },
  });

  // 7) 별용 플랫폼 (오직 공과만 충돌)
  const horizontalPlatformForStar = Matter.Bodies.rectangle(730, 495, 40, 40, {
    isStatic: true,
    label: 'horizontalPlatformForStar',
    render: { fillStyle: '#6b7280' },
    collisionFilter: {
      category: PLATFORM_CATEGORY,
      mask:     BALL_CATEGORY,
    },
  });

  // 8) 구름 (내가 그린 핀과는 충돌 안 하고, 오직 공만 부딪침)
  const cloudVertices = [
    { x: 0, y: 20 }, { x: 20, y: 0 }, { x: 50, y: -5 },
    { x: 80, y: 0 }, { x: 100, y: 20 }, { x: 90, y: 40 },
    { x: 70, y: 50 }, { x: 50, y: 45 }, { x: 30, y: 50 },
    { x: 10, y: 40 },
  ];
  const cloud = Matter.Bodies.fromVertices(
    150,
    300,
    [cloudVertices],
    {
      isStatic: true,
      label: 'cloud',
      render: {
        fillStyle: 'rgba(0,0,0,0)',
        strokeStyle: '#397896',
        lineWidth: 5,
      },
      collisionFilter: {
        category: CLOUD_CATEGORY,
        mask:     BALL_CATEGORY,
      },
    },
    true,
  );
  Matter.Body.scale(cloud, 2.5, 1.5);

  // 9) 월드에 추가
  Matter.World.add(world, [
    ...walls,
    ball,
    star,
    horizontalPlatformForBall,
    horizontalPlatform,
    slope,
    horizontalPlatformForStar,
    cloud,
  ]);

  // 10) 반환
  return [
    ...walls,
    ball,
    star,
    horizontalPlatformForBall,
    horizontalPlatform,
    slope,
    horizontalPlatformForStar,
    cloud,
  ];
};
