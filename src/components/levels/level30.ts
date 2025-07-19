// src/components/levels/level32Creative.ts
import Matter from 'matter-js';
import type { LevelFactory } from './index';

export const createLevel30: LevelFactory = (world) => {
  const bodies: Matter.Body[] = [];
  const constraints: Matter.Constraint[] = [];

  // 바닥
  bodies.push(Matter.Bodies.rectangle(400, 610, 810, 20, {
    isStatic: true, label: 'wall_bottom',
    render: { fillStyle: '#6b7280' }
  }));

  // 공
  bodies.push(Matter.Bodies.circle(50, 50, 12, {
    restitution: 0.5, label: 'ball',
    render: { fillStyle: '#ef4444' }
  }));

  // 나선형 램프 생성 (5개 세그먼트)
  for (let i = 0; i < 5; i++) {
    const ramp = Matter.Bodies.rectangle(
      200 + i*100,
      150 + i*60,
      200,
      20,
      {
        isStatic: true,
        angle: Math.PI/4 * (i % 2 ? -1 : 1),
        label: `spiral${i}`,
        render: { fillStyle: '#4b5563' }
      }
    );
    bodies.push(ramp);
  }

  // 회전 추(스윙)
  const swingPivot = Matter.Bodies.circle(600, 200, 8, {
    isStatic: true, label: 'pivot32',
    render: { fillStyle: '#111827' }
  });
  const swingBob = Matter.Bodies.circle(600, 320, 20, {
    density: 0.02, label: 'bob32',
    render: { fillStyle: '#3b82f6' }
  });
  bodies.push(swingPivot, swingBob);

  constraints.push(Matter.Constraint.create({
    bodyA: swingPivot, pointA: { x: 0, y: 0 },
    bodyB: swingBob, pointB: { x: 0, y: -20 },
    length: 140, stiffness: 1
  }));

  // 목표 풍선
  const balloon = Matter.Bodies.trapezoid(750, 550, 20, 20,1, {
        isStatic: true, label: 'balloon',
        render: { fillStyle: '#fbbf24' }
      });
      bodies.push(balloon);

  Matter.World.add(world, [...bodies, ...constraints]);
  return [...bodies, ...constraints];
};
