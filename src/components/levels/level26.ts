import Matter from 'matter-js';
import type { LevelFactory } from './index';

// Factory for Map 10 (Level 26)
export const createLevel26: LevelFactory = (world) => {
  const walls = [
    Matter.Bodies.rectangle(400, 610, 810, 20, { isStatic: true, label: 'wall_bottom', collisionFilter: { category: 0x0001, mask: 0xFFFF } }),
  ];
  walls.forEach(w => Matter.Body.setStatic(w, true));

  const ball = Matter.Bodies.circle(150, 545, 15, { render: { fillStyle: '#ef4444' }, label: 'ball', restitution: 0x0003, friction: 0.05, frictionAir: 0.01, collisionFilter: { category: 0x0001, mask: 0xFFFF } });
  const horizontalPlatform = Matter.Bodies.rectangle(150, 550, 150, 100, { isStatic: true, label: 'horizontal_platform', render: { fillStyle: '#6b7280' }, collisionFilter: { category: 0x0001, mask: 0xFFFF } });
  const star = Matter.Bodies.trapezoid(600, 130, 20, 20, 1, { isStatic: true, label: 'balloon', render: { fillStyle: '#fbbf24' }, collisionFilter: { category: 0x0001, mask: 0x0001 } });
  const frameTop = Matter.Bodies.rectangle(600, 80, 100, 25, { isStatic: true, label: 'frame_top', render: { fillStyle: '#94a3b8' }, collisionFilter: { category: 0x0001, mask: 0xFFFF } });
  const frameLeft = Matter.Bodies.rectangle(550, 110, 25, 85, { isStatic: true, label: 'frame_left', render: { fillStyle: '#94a3b8' }, collisionFilter: { category: 0x0001, mask: 0xFFFF } });
  const frameRight = Matter.Bodies.rectangle(650, 110, 25, 85, { isStatic: true, label: 'frame_right', render: { fillStyle: '#94a3b8' }, collisionFilter: { category: 0x0001, mask: 0xFFFF } });

  Matter.World.add(world, [
    ...walls,
    ball,
    horizontalPlatform,
    star,
    frameTop,
    frameLeft,
    frameRight,
  ]);

  return [
    ...walls,
    ball,
    horizontalPlatform,
    star,
    frameTop,
    frameLeft,
    frameRight,
  ];
};
