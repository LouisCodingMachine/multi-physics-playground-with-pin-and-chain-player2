import Matter from 'matter-js';
import type { LevelFactory } from './index';

// Factory for Map 4 (Level 22)
export const createLevel22: LevelFactory = (world) => {
  // Walls
  const walls = [
    Matter.Bodies.rectangle(400, 610, 810, 20, { isStatic: true, label: 'wall_bottom', collisionFilter: { category: 0x0001, mask: 0xFFFF } }),
  ];
  walls.forEach(w => Matter.Body.setStatic(w, true));

  // Ball and Star
  const ball = Matter.Bodies.circle(400, 180, 15, { render: { fillStyle: '#ef4444' }, label: 'ball', restitution: 0.3, friction: 0.05, frictionAir: 0.01, collisionFilter: { category: 0x0001, mask: 0xFFFF } });
  const star = Matter.Bodies.trapezoid(400, 350, 20, 20, 1, { isStatic: true, label: 'balloon', render: { fillStyle: '#fbbf24' }, collisionFilter: { category: 0x0001, mask: 0x0001 } });

  // Level-specific platforms
  const topBar = Matter.Bodies.rectangle(400, 200, 150, 10, { isStatic: true, label: 'top_bar', render: { fillStyle: '#6b7280' }, collisionFilter: { category: 0x0001, mask: 0xFFFF } });
  const verticalBar = Matter.Bodies.rectangle(400, 250, 10, 100, { isStatic: true, label: 'vertical_bar', render: { fillStyle: '#6b7280' }, collisionFilter: { category: 0x0001, mask: 0xFFFF } });
  const redBox = Matter.Bodies.rectangle(400, 375, 30, 30, { isStatic: true, label: 'red_box', render: { fillStyle: '#ef4444' }, collisionFilter: { category: 0x0001, mask: 0xFFFF } });
  const leftUpGreenPlatform = Matter.Bodies.rectangle(200, 300, 60, 10, { isStatic: true, label: 'left_up_green_platform', render: { fillStyle: '#10b981' }, collisionFilter: { category: 0x0001, mask: 0xFFFF } });
  const leftDownGreenPlatform = Matter.Bodies.rectangle(250, 500, 60, 10, { isStatic: true, label: 'left_down_green_platform', render: { fillStyle: '#10b981' }, collisionFilter: { category: 0x0001, mask: 0xFFFF } });
  const rightUpGreenPlatform = Matter.Bodies.rectangle(550, 300, 60, 10, { isStatic: true, label: 'right_up_green_platform', render: { fillStyle: '#10b981' }, collisionFilter: { category: 0x0001, mask: 0xFFFF } });
  const rightDownGreenPlatform = Matter.Bodies.rectangle(500, 500, 60, 10, { isStatic: true, label: 'right_down_green_platform', render: { fillStyle: '#10b981' }, collisionFilter: { category: 0x0001, mask: 0xFFFF } });

  Matter.World.add(world, [
    ...walls,
    ball,
    star,
    topBar,
    verticalBar,
    redBox,
    leftUpGreenPlatform,
    leftDownGreenPlatform,
    rightUpGreenPlatform,
    rightDownGreenPlatform,
  ]);

  return [
    ...walls,
    ball,
    star,
    topBar,
    verticalBar,
    redBox,
    leftUpGreenPlatform,
    leftDownGreenPlatform,
    rightUpGreenPlatform,
    rightDownGreenPlatform,
  ];
};