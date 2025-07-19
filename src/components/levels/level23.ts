import Matter from 'matter-js';
import type { LevelFactory } from './index';

// Factory for Map 6 (Level 23)
export const createLevel23: LevelFactory = (world) => {
  // Walls
  const walls = [
    Matter.Bodies.rectangle(400, 610, 810, 20, { isStatic: true, label: 'wall_bottom', collisionFilter: { category: 0x0001, mask: 0xFFFF } }),
  ];
  walls.forEach(w => Matter.Body.setStatic(w, true));

  // Ball
  const ball = Matter.Bodies.circle(150, 400, 15, { render: { fillStyle: '#ef4444' }, label: 'ball', restitution: 0.3, friction: 0.05, frictionAir: 0.01, collisionFilter: { category: 0x0001, mask: 0xFFFF } });

  // Platform and Star
  const horizontalDownPlatform = Matter.Bodies.rectangle(150, 450, 200, 150, { isStatic: true, label: 'horizontal_down_platform', render: { fillStyle: '#6b7280' }, collisionFilter: { group: -1, category: 0x0002, mask: 0xFFFF & ~0x0002 } });
  const star = Matter.Bodies.trapezoid(700, 350, 20, 20, 1, { isStatic: true, label: 'balloon', render: { fillStyle: '#fbbf24' }, collisionFilter: { category: 0x0001, mask: 0x0001 } });

  // Nails and Constraints
  const nail7_0 = Matter.Bodies.circle(230, 410, 10, { isStatic: true, label: 'nail7_0', collisionFilter: { group: -1, category: 0x0002, mask: 0x0000 }, render: { fillStyle: 'rgba(0,0,0,0)', strokeStyle: '#fbbf24', lineWidth: 3 } });
  const constraint7_0 = Matter.Constraint.create({ bodyA: horizontalDownPlatform, pointA: { x: 230 - 150, y: 410 - 450 }, bodyB: nail7_0, pointB: { x: 0, y: 0 }, stiffness: 1, length: 0, render: { visible: false } });
  const nail7_1 = Matter.Bodies.circle(70, 410, 10, { isStatic: true, label: 'nail7_1', collisionFilter: { group: -1, category: 0x0002, mask: 0x0000 }, render: { fillStyle: 'rgba(0,0,0,0)', strokeStyle: '#fbbf24', lineWidth: 3 } });
  const constraint7_1 = Matter.Constraint.create({ bodyA: horizontalDownPlatform, pointA: { x: 70 - 150, y: 410 - 450 }, bodyB: nail7_1, pointB: { x: 0, y: 0 }, stiffness: 1, length: 0, render: { visible: false } });

  Matter.World.add(world, [
    ...walls,
    ball,
    horizontalDownPlatform,
    star,
    nail7_0,
    constraint7_0,
    nail7_1,
    constraint7_1,
  ]);

  return [
    ...walls,
    ball,
    horizontalDownPlatform,
    star,
    nail7_0,
    constraint7_0,
    nail7_1,
    constraint7_1,
  ];
};