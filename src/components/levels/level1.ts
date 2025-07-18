// src/levels/level20.ts
import Matter from 'matter-js';
import type { LevelFactory } from './index';

export const createLevel1: LevelFactory = (world) => {
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

  // 1) 왼쪽에 세로로 긴 땅 (벽처럼)
  const leftWall = Matter.Bodies.rectangle(
    50, 500, 300, 400,
    {
      isStatic: true,
      label: 'vertical_ground_20',
      render: { fillStyle: '#6b7280' },
      collisionFilter: { category: 0x0001, mask: 0xFFFF },
    }
  );

  // 2) 그 옆의 큰 땅 (수평 플랫폼)
  const ground = Matter.Bodies.rectangle(
    350, 600, 600, 120,
    {
      isStatic: true,
      label: 'ground_20',
      render: { fillStyle: '#6b7280' },
      collisionFilter: { category: 0x0001, mask: 0xFFFF },
    }
  );

  // 3) 작은 사각형 축 (fulcrum base)
  const fulcrumBase = Matter.Bodies.rectangle(
    350, 530, 10, 70,
    {
      isStatic: true,
      label: 'fulcrum_base_20',
      render: { fillStyle: '#6b7280' },
      collisionFilter: {
        group: -1,
        category: 0x0001,
        mask: 0xFFFF,
      },
    }
  );

  // 4) 힌지 원 (pivotCircle)
  const pivotCircle = Matter.Bodies.circle(
    350, 490, 5,
    {
      isStatic: true,
      label: 'pivot_circle_20',
      render: { fillStyle: '#fbbf24', strokeStyle: '#fbbf24', lineWidth: 1 },
      collisionFilter: {
        group: -1,
        category: 0x0001,
        mask: 0xFFFF,
      },
    }
  );

  // 5) 시소 판자 (lever)
  const lever = Matter.Bodies.rectangle(
    350, 520, 300, 20,
    {
      label: 'lever',
      frictionAir:  0.001,  
      render: { fillStyle: '#6b7280' },
      collisionFilter: { group: -1, category: 0x0001, mask: 0xFFFF },
    }
  );

  const hingeConstraint = Matter.Constraint.create({
    bodyA: lever,
    pointA: { x: 0, y: 0 },
    bodyB: pivotCircle,
    pointB: { x: 0, y: 0 },
    length: 0,
    stiffness: 1,
    damping: 0,
    render: { visible: false },
  });

  // 6) 공 생성 (시소 위)
  const ballY = 490 - 10 - 15; // pivot y - lever half-height - ball radius
  const ball = Matter.Bodies.circle(
    230, ballY, 15,
    {
      label: 'ball',
      restitution: 0.3,
      friction: 0.05,
      frictionAir: 0.01,
      render: { fillStyle: '#ef4444' },
      collisionFilter: { category: 0x0001, mask: 0xFFFF },
    }
  );
  // initialBallPositionRef.current = { x: 230, y: ballY };
  // ballRef.current = ball;

  // 7) 오른쪽 끝에 별 생성
  const star = Matter.Bodies.trapezoid(
    600, 530, 20, 20, 1,
    {
      isStatic: true,
      label: 'balloon',
      render: { fillStyle: '#fbbf24' },
      collisionFilter: { category: 0x0001, mask: 0x0001 },
    }
  );

  // 월드에 바디 추가
  Matter.World.add(world, [...walls,
    leftWall,
    ground,
    fulcrumBase,
    pivotCircle,
    lever,
    hingeConstraint,
    ball,
    star,
  ]);

  // 반환
  return [...walls,
    leftWall,
    ground,
    fulcrumBase,
    pivotCircle,
    lever,
    ball,
    star,
  ];
};
