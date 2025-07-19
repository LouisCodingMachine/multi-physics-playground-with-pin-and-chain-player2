// src/components/levels/level29Creative.ts
import Matter from 'matter-js';
import type { LevelFactory } from './index';

export const createLevel27: LevelFactory = (world) => {
  const bodies: Matter.Body[] = [];
  const constraints: Matter.Constraint[] = [];

  // 바닥
  const wall = Matter.Bodies.rectangle(400, 610, 810, 20, {
    isStatic: true, label: 'wall_bottom',
    render: { fillStyle: '#6b7280' }
  });
  bodies.push(wall);

  // 공 시작 위치
  const ball = Matter.Bodies.circle(300, 200, 15, {
    restitution: 0.6, friction: 0.02,
    label: 'ball', render: { fillStyle: '#ef4444' }
  });
  bodies.push(ball);

  // 시소 판
  const plank = Matter.Bodies.rectangle(400, 400, 300, 20, {
    label: 'seesaw', render: { fillStyle: '#4b5563' }
  });
  bodies.push(plank);

  // 시소 축
  const pivot = Matter.Bodies.circle(400, 400, 10, {
    isStatic: true, label: 'pivot', render: { fillStyle: '#111827' }
  });
  bodies.push(pivot);

  // 시소 연결
  constraints.push(Matter.Constraint.create({
    bodyA: plank, pointA: { x: 0, y: 0 },
    bodyB: pivot, pointB: { x: 0, y: 0 },
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
