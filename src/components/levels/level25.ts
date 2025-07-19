import Matter from 'matter-js';
import type { LevelFactory } from './index';

// Factory for Map 9 (Level 25)
export const createLevel25: LevelFactory = (world) => {
  const walls = [
    Matter.Bodies.rectangle(400, 610, 810, 20, { isStatic: true, label: 'wall_bottom', collisionFilter: { category: 0x0001, mask: 0xFFFF } }),
  ];
  walls.forEach(w => Matter.Body.setStatic(w, true));

  const ball = Matter.Bodies.circle(500, 250, 15, { render: { fillStyle: '#ef4444' }, label: 'ball', restitution: 0x0003, friction: 0.05, frictionAir: 0.01, collisionFilter: { category: 0x0001, mask: 0xFFFF } });
  const star = Matter.Bodies.trapezoid(150, 310, 20, 20, 1, { isStatic: true, label: 'balloon', render: { fillStyle: '#fbbf24' }, collisionFilter: { category: 0x0001, mask: 0x0001 } });
  const redPlatform = Matter.Bodies.rectangle(120, 340, 250, 30, { isStatic: true, label: 'red_platform', render: { fillStyle: '#ef4444' }, collisionFilter: { category: 0x0001, mask: 0xFFFF } });
  const greenRamp = Matter.Bodies.trapezoid(520, 310, 220, 100, 2, { isStatic: true, label: 'green_ramp', render: { fillStyle: '#10b981' }, collisionFilter: { category: 0x0001, mask: 0xFFFF } });
  const centralUpObstacle = Matter.Bodies.rectangle(400, 170, 90, 350, { isStatic: true, label: 'central_up_obstacle', render: { fillStyle: '#3b82f6' }, collisionFilter: { category: 0x0001, mask: 0xFFFF } });
  const centralDownObstacle = Matter.Bodies.rectangle(400, 550, 90, 100, { isStatic: true, label: 'central_down_obstacle', render: { fillStyle: '#3b82f6' }, collisionFilter: { category: 0x0001, mask: 0xFFFF } });

  Matter.World.add(world, [
    ...walls,
    ball,
    star,
    redPlatform,
    greenRamp,
    centralUpObstacle,
    centralDownObstacle,
  ]);

  return [
    ...walls,
    ball,
    star,
    redPlatform,
    greenRamp,
    centralUpObstacle,
    centralDownObstacle,
  ];
};