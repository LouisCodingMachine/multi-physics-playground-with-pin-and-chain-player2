import Matter from 'matter-js';
import type { LevelFactory } from './index';

// Factory for Map 7 (Level 24)
export const createLevel24: LevelFactory = (world) => {
  const walls = [
    Matter.Bodies.rectangle(400, 610, 810, 20, { isStatic: true, label: 'wall_bottom', collisionFilter: { category: 0x0001, mask: 0xFFFF } }),
  ];
  walls.forEach(w => Matter.Body.setStatic(w, true));

  const ball = Matter.Bodies.circle(100, 300, 15, { render: { fillStyle: '#ef4444' }, label: 'ball', restitution: 0.3, friction: 0.05, frictionAir: 0.01, collisionFilter: { category: 0x0001, mask: 0xFFFF } });
  const star = Matter.Bodies.trapezoid(650, 520, 20, 20, 1, { isStatic: true, label: 'balloon', render: { fillStyle: '#fbbf24' }, collisionFilter: { category: 0x0001, mask: 0x0001 } });
  const leftRedWall = Matter.Bodies.rectangle(600, 335, 40, 450, { isStatic: true, label: 'left_red_wall', render: { fillStyle: '#ef4444' }, collisionFilter: { category: 0x0001, mask: 0xFFFF } });
  const rightRedWall = Matter.Bodies.rectangle(700, 335, 40, 450, { isStatic: true, label: 'right_red_wall', render: { fillStyle: '#ef4444' }, collisionFilter: { category: 0x0001, mask: 0xFFFF } });
  const bottomRedWall = Matter.Bodies.rectangle(650, 550, 140, 30, { isStatic: true, label: 'bottom_red_wall', render: { fillStyle: '#ef4444' }, collisionFilter: { category: 0x0001, mask: 0xFFFF } });

  Matter.World.add(world, [
    ...walls,
    ball,
    star,
    leftRedWall,
    rightRedWall,
    bottomRedWall,
  ]);

  return [
    ...walls,
    ball,
    star,
    leftRedWall,
    rightRedWall,
    bottomRedWall,
  ];
};