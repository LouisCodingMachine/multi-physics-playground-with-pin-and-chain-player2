// src/components/levels/level30Creative.ts
import Matter from 'matter-js';
import type { LevelFactory } from './index';

export const createLevel28: LevelFactory = (world) => {
  const bodies: Matter.Body[] = [];
  const constraints: Matter.Constraint[] = [];

  // 바닥
  bodies.push(Matter.Bodies.rectangle(400, 610, 810, 20, {
    isStatic: true, label: 'wall_bottom',
    render: { fillStyle: '#6b7280' }
  }));

  // 공
  bodies.push(Matter.Bodies.circle(50, 100, 12, {
    restitution: 0.4, label: 'ball',
    render: { fillStyle: '#ef4444' }
  }));

  // 트램폴린 패드 (탄성 플랫폼)
  const pad = Matter.Bodies.rectangle(300, 500, 200, 20, {
    isStatic: true, label: 'trampoline',
    render: { fillStyle: '#10b981' }
  });
  bodies.push(pad);

  // pad에 보강 스프링 역할 constraint (시각용)
  constraints.push(Matter.Constraint.create({
    bodyA: pad, pointA: { x: -80, y: -10 },
    pointB: { x: 300 - 80, y: 500 - 10 },
    stiffness: 0.05, damping: 0.2
  }));
  constraints.push(Matter.Constraint.create({
    bodyA: pad, pointA: { x: 80, y: -10 },
    pointB: { x: 300 + 80, y: 500 - 10 },
    stiffness: 0.05, damping: 0.2
  }));

  // 경사로
  bodies.push(Matter.Bodies.rectangle(550, 400, 300, 20, {
    isStatic: true, angle: -Math.PI/8,
    label: 'ramp', render: { fillStyle: '#6b7280' }
  }));

  const balloon = Matter.Bodies.trapezoid(750, 300, 20, 20,1, {
      isStatic: true, label: 'balloon',
      render: { fillStyle: '#fbbf24' }
    });
    bodies.push(balloon);

  Matter.World.add(world, [...bodies, ...constraints]);
  return [...bodies, ...constraints];
};
