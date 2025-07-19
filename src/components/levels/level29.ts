// src/components/levels/level31Creative.ts
import Matter from 'matter-js';
import type { LevelFactory } from './index';

export const createLevel29: LevelFactory = (world) => {
  const bodies: Matter.Body[] = [];
  const constraints: Matter.Constraint[] = [];

  // 바닥
  bodies.push(Matter.Bodies.rectangle(400, 610, 810, 20, {
    isStatic: true, label: 'wall_bottom',
    render: { fillStyle: '#6b7280' }
  }));

  // 시작 공
  bodies.push(Matter.Bodies.circle(100, 120, 15, {
    restitution: 0.4, label: 'ball',
    render: { fillStyle: '#ef4444' }
  }));

  // 지그재그 플랫폼 3개
  const zig1 = Matter.Bodies.rectangle(250, 300, 200, 20, {
    isStatic: true, angle: Math.PI/8, label: 'zig1',
    render: { fillStyle: '#4b5563' }
  });
  const zig2 = Matter.Bodies.rectangle(450, 350, 200, 20, {
    isStatic: true, angle: -Math.PI/8, label: 'zig2',
    render: { fillStyle: '#4b5563' }
  });
  const zig3 = Matter.Bodies.rectangle(650, 300, 200, 20, {
    isStatic: true, angle: Math.PI/8, label: 'zig3',
    render: { fillStyle: '#4b5563' }
  });
  bodies.push(zig1, zig2, zig3);

  // 회전 기어 (중앙 기어)
  const gear = Matter.Bodies.circle(400, 450, 40, {
    isStatic: true, label: 'gear',
    render: { fillStyle: '#111827' }
  });
  bodies.push(gear);

  // gear 회전하는 작은 원 (시각용 constraint)
  constraints.push(Matter.Constraint.create({
    bodyA: gear, pointA: { x: 0, y: 0 },
    pointB: { x: 400, y: 450 },
    length: 0, stiffness: 1
  }));

  // 목표 풍선
  const balloon = Matter.Bodies.trapezoid(750, 150, 20, 20,1, {
        isStatic: true, label: 'balloon',
        render: { fillStyle: '#fbbf24' }
      });
      bodies.push(balloon);

  Matter.World.add(world, [...bodies, ...constraints]);
  return [...bodies, ...constraints];
};
