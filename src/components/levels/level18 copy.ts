// src/levels/level23.ts
import Matter from 'matter-js';
import type { LevelFactory } from './index';

export const createLevel18: LevelFactory = (world) => {
  // 기본 벽 옵션
  const wallOptions = {
    isStatic: true,
    label: 'wall',
    collisionFilter: {
    category: 0x0001,
    mask: 0xFFFF,
    },
  };
  const walls = [
    Matter.Bodies.rectangle(400, 610, 810, 20, { ...wallOptions, label: 'wall_bottom' }),
  ];
  walls.forEach((wall) => {
    Matter.Body.setStatic(wall, true);
    wall.render.fillStyle = '#94a3b8';
  });

  // 1) 왼쪽에 세로로 긴 직사각형 타워
  const leftTower = Matter.Bodies.rectangle(
    80, 500, 80, 300,
    {
      isStatic: true,
      label: 'leftTower_23',
      render: { fillStyle: '#6b7280' },
      collisionFilter: { category: 0x0001, mask: 0xFFFF },
    }
  );

  // 2) 왼쪽 타워 위에 공 얹기
  const ballStartY = 500 - 300 / 2 - 15;
  const ball = Matter.Bodies.circle(
    80, ballStartY, 15,
    {
      label: 'ball',
      frictionAir:  0.001,  
      render: { fillStyle: '#ef4444' },
      collisionFilter: { category: 0x0001, mask: 0xFFFF },
    }
  );

  // 3) 화면 2/3 지점에 두 번째 타워
  const midX = (800 * 2) / 3;
  const midTower = Matter.Bodies.rectangle(
    midX, 500, 80, 300,
    {
      isStatic: true,
      label: 'midTower_23',
      render: { fillStyle: '#6b7280' },
      collisionFilter: { category: 0x0001, mask: 0xFFFF },
    }
  );

  // 4) pivot: midTower 왼쪽 상단 모서리
  const pivotX = midX - 80 / 2;
  const pivotY = 500 - 300 / 2;
  const pivot = Matter.Bodies.circle(
    pivotX, pivotY, 5,
    {
      isStatic: true,
      label: 'axePivot_23',
      render: { fillStyle: '#fbbf24' },
      collisionFilter: { group: -1, category: 0x0001, mask: 0xFFFF },
    }
  );

  // 5) axeHead & axeHandle 복합체
  const headSize = 100;
  const handleWidth = 10;
  const handleHeight = 250;
  const headCenterX = pivotX + headSize / 2-100;
  const headCenterY = pivotY + headSize / 2;
  const handleCenterX = headCenterX - 45+90;
  const handleCenterY = headCenterY + headSize / 2 + handleHeight / 2-350;

  const axe = Matter.Body.create({
    parts: [
      Matter.Bodies.rectangle(
        headCenterX, headCenterY, headSize, headSize,
        { render: { fillStyle: '#b45309' } }
      ),
      Matter.Bodies.rectangle(
        handleCenterX, handleCenterY, handleWidth, handleHeight,
        { render: { fillStyle: '#92400e' } }
      )
    ],
    label: 'axe_23',
    isStatic: false,
    collisionFilter: { group: -1, category: 0x0001, mask: 0xFFFF },
    frictionAir: 0.001,
    restitution: 0.2,
  });

  // 6) pivot ↔ axe 힌지
  const hinge = Matter.Constraint.create({
    bodyA: axe,
    pointA: { x: 50, y: -20},
    bodyB: pivot,
    pointB: { x: 0, y: 0 },
    length: 0,
    stiffness: 1,
    damping: 0,
    render: { visible: false },
  });

  // 7) 오른쪽 맨 끝에 떠 있는 별
  const star = Matter.Bodies.trapezoid(
    750, 300, 20, 20, 1,
    {
      isStatic: true,
      label: 'balloon',
      render: { fillStyle: '#fbbf24' },
      collisionFilter: { category: 0x0001, mask: 0x0001 },
    }
  );

  // 월드에 바디 추가
  Matter.World.add(world, [...walls,
    leftTower,
    ball,
    midTower,
    pivot,
    axe,
    hinge,
    star,
  ]);

  // 반환
  return [...walls,
    leftTower,
    ball,
    midTower,
    pivot,
    axe,
    hinge,
    star,
  ];
};