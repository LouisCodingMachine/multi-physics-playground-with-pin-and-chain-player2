// src/levels/level12.ts
import Matter from 'matter-js';
import type { LevelFactory } from './index';

export const createLevel5: LevelFactory = (world) => {
  const wallOptions: Matter.IBodyDefinition = {
      isStatic: true,
      label: 'wall',
      collisionFilter: {
        group: -1,
        category: 0x0001,
        mask: 0xFFFF,
      },
      render: { fillStyle: '#94a3b8' },
    };
    const walls = [
      Matter.Bodies.rectangle(400, 610, 810, 20, { ...wallOptions, label: 'wall_bottom' }),
    ];
  // 1) 왼쪽 박스 두 개 (첫 번째가 더 높음)
  const leftHigh = Matter.Bodies.rectangle(35, 500, 80, 200, { 
    isStatic: true,
    label: 'leftHigh',
    render: { fillStyle: '#10b981' },
    collisionFilter: { category: 0x0001, mask: 0xFFFF }
  });
  const leftLow = Matter.Bodies.rectangle(115, 520, 80, 160, { 
    isStatic: true,
    label: 'leftLow',
    render: { fillStyle: '#10b981' },
    collisionFilter: { category: 0x0001, mask: 0xFFFF }
  });

  // 2) 공: 첫 번째 박스 위에
  const ball = Matter.Bodies.circle(40, 410, 15, {
    label: 'ball',
    frictionAir:  0.001,   
    render: { fillStyle: '#ef4444' },
    collisionFilter: { category: 0x0001, mask: 0xFFFF }
  });

  // 3) 권총 모양 박스
  const gunBoxTall = Matter.Bodies.rectangle(750, 420, 100, 400, {
    isStatic: true,
    label: 'gunBox2',
    render: { fillStyle: '#6b7280' },
    collisionFilter: { category: 0x0001, mask: 0xFFFF }
  });
  const gunBoxWide = Matter.Bodies.rectangle(750, 220, 510, 100, {
    isStatic: true,
    label: 'gunBox',
    render: { fillStyle: '#6b7280' },
    collisionFilter: { category: 0x0001, mask: 0xFFFF }
  });
  const gunBoxSmall = Matter.Bodies.rectangle(490, 250, 20, 20, {
    isStatic: true,
    label: 'gunBox3',
    render: { fillStyle: '#6b7280' },
    collisionFilter: { category: 0x0001, mask: 0xFFFF }
  });

  // 4) 권총 아래 땅 역할 박스
  const groundUnderGun = Matter.Bodies.rectangle(650, 530, 320, 200, {
    isStatic: true,
    label: 'groundUnderGun',
    render: { fillStyle: '#10b981' },
    collisionFilter: { category: 0x0001, mask: 0xFFFF }
  });

  // 5) 힌지 달린 상자 + fulcrum + pivot
  const hingeBox = Matter.Bodies.rectangle(400, 155, 300, 35, {
    label: 'lever',
    render: { fillStyle: '#6b7280' },
    collisionFilter: { category: 0x0002, mask: 0xFFFF }
  });
  const fulcrum = Matter.Bodies.circle(370, 400, 5, {
    isStatic: true,
    label: 'fulcrum',
    render: { fillStyle: 'rgba(0,0,0,0)', strokeStyle: '#fbbf24', lineWidth: 1 },
    collisionFilter: { group: -1, category: 0x0001, mask: 0x0001 }
  });
  const pivot = Matter.Constraint.create({
    bodyA: hingeBox,
    pointA: { x: 140, y: 0 },
    bodyB: fulcrum,
    pointB: { x: 0, y: 0 },
    length: 0,
    stiffness: 0.5,
  // damping:   0.5,
    render: { visible: false }
  });

  // 6) 숨겨진 별
  const star = Matter.Bodies.trapezoid(670, 423, 20, 20, 1, {
    isStatic: true,
    label: 'balloon',
    render: { fillStyle: '#fbbf24' },
    collisionFilter: { category: 0x0001, mask: 0x0001 }
  });

  // 월드에 바디 추가
  Matter.World.add(world, [
    ...walls,
    leftHigh, leftLow,
    ball,
    gunBoxTall, gunBoxWide, gunBoxSmall,
    groundUnderGun,
    hingeBox, fulcrum, pivot,
    star
  ]);

  // 반환
  return [
    ...walls,
    leftHigh, leftLow,
    ball,
    gunBoxTall, gunBoxWide, gunBoxSmall,
    groundUnderGun,
    hingeBox, fulcrum, pivot,
    star
  ];
};
