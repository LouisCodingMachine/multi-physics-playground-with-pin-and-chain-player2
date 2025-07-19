// src/components/levels/level28Creative.ts
import Matter from 'matter-js';
import type { LevelFactory } from './index';

export const createLevel21: LevelFactory = (world) => {
  const bodies: Matter.Body[] = [];
  const constraints: Matter.Constraint[] = [];

  // 1) 바닥
  const wallBottom = Matter.Bodies.rectangle(
    400, 610,    // x, y
    810, 20,     // width, height
    {
      isStatic: true,
      label: 'wall_bottom',
      collisionFilter: { category: 0x0001, mask: 0xFFFF },
      render: { fillStyle: '#6b7280' },
    }
  );
  bodies.push(wallBottom);

  // 2) 시작 공
  const ball = Matter.Bodies.circle(
    50, 200, 15,
    {
      restitution: 0.5,
      friction: 0.05,
      frictionAir: 0.01,
      label: 'ball',
      collisionFilter: { category: 0x0001, mask: 0xFFFF },
      render: { fillStyle: '#ef4444' },
    }
  );
  bodies.push(ball);

  // 3) 경사로 1
  const ramp1 = Matter.Bodies.rectangle(
    150, 300,
    300, 20,
    {
      isStatic: true,
      angle: -Math.PI / 1,
      label: 'ramp1',
      render: { fillStyle: '#6b7280' },
      collisionFilter: { category: 0x0002, mask: 0xFFFF },
    }
  );
  bodies.push(ramp1);

  // 4) 펜듈럼 피벗
  const pivot = Matter.Bodies.circle(
    400, 100, 7,
    {
      isStatic: true,
      label: 'pivot',
      render: { fillStyle: '#111827' },
    }
  );
  bodies.push(pivot);

  // 5) 펜듈럼 추
  const bob = Matter.Bodies.circle(
    400, 220, 20,
    {
      density: 0.02,
      frictionAir: 0.0005,
      label: 'bob',
      render: { fillStyle: '#10b981' },
    }
  );
  bodies.push(bob);

  // 6) 로프 제약조건
  const rope = Matter.Constraint.create({
    bodyA: pivot,
    pointA: { x: 0, y: 0 },
    bodyB: bob,
    pointB: { x: 0, y: -20 },
    length: 120,
    stiffness: 1,
    render: {
      visible: true,
      lineWidth: 3,
      strokeStyle: '#374151',
    },
  });
  constraints.push(rope);

  // 7) 경사로 2
  const ramp2 = Matter.Bodies.rectangle(
    600, 400,
    200, 20,
    {
      isStatic: true,
      angle: Math.PI / 8,
      label: 'ramp2',
      render: { fillStyle: '#6b7280' },
      collisionFilter: { category: 0x0002, mask: 0xFFFF },
    }
  );
  bodies.push(ramp2);

  // 8) 목표 풍선(별)
  const balloon = Matter.Bodies.trapezoid(
    730, 550,
    20, 20, 1,
    {
      isStatic: true,
      label: 'balloon',
      render: { fillStyle: '#fbbf24' },
      collisionFilter: { category: 0x0001, mask: 0x0001 },
    }
  );
  const star = Matter.Bodies.trapezoid(700, 350, 20, 20, 1, { isStatic: true, label: 'balloon', render: { fillStyle: '#fbbf24' }, collisionFilter: { category: 0x0001, mask: 0x0001 } });


  
  bodies.push(balloon);

  // 월드에 모두 추가
  Matter.World.add(world, [
    ...bodies,
    ...constraints,
  ]);

  // 반환: 플레이어 드로잉과 충돌 없이 레벨 빌드에 사용된 모든 바디와 제약조건
  return [
    ...bodies,
    ...constraints,
  ];
};
