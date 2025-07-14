// src/levels/level18.ts
import Matter from 'matter-js';
import type { LevelFactory } from './index';

export const createLevel18: LevelFactory = (world) => {
  // ─── 0) 레버 및 바구니 설정 ───
  const leverConfig = {
    x: 205,
    y: 320,
    width: 400,
    height: 20,
    density: 0.0001,
    friction: 0,
    frictionStatic: 0,
    restitution: 1,
  };
  const basketConfig = {
    width: 80,
    height: 10,
    wallThickness: 10,
    wallHeight: 20,
    // 레버 왼쪽 끝에서 바구니 위치 오프셋
    offsetX: -leverConfig.width / 2 + 40,
    offsetY: leverConfig.height / 2 + -15,
  };

  // ─── 1) 바닥 ───
  const floor = Matter.Bodies.rectangle(400, 610, 810, 20, {
    isStatic: true,
    label: 'wall_bottom',
    render: { fillStyle: '#94a3b8' },
    collisionFilter: { category: 0x0001, mask: 0xFFFF },
  });

  // ─── 2) 공 ───
  const ball = Matter.Bodies.circle(50, 310, 15, {
    label: 'ball',
    restitution: 0.4,
    frictionAir: 0.001,
    friction: 0,
    render: { fillStyle: '#ef4444' },
    collisionFilter: { category: 0x0001, mask: 0xFFFF },
  });

  // ─── 3) 판자(plank) ───
  const plank = Matter.Bodies.rectangle(
    leverConfig.x,
    leverConfig.y,
    leverConfig.width,
    leverConfig.height,
    {
      label: 'leverPlank',
      density: leverConfig.density,
      friction: leverConfig.friction,
      frictionStatic: leverConfig.frictionStatic,
      restitution: leverConfig.restitution,
      render: { fillStyle: '#4B0082' },
      collisionFilter: { group: -1, category: 0x0002, mask: 0xFFFF & ~0x0002 },
    }
  );

  // ─── 4) 바구니(basket) ───
  const basketBaseX = leverConfig.x + basketConfig.offsetX;
  const basketBaseY = leverConfig.y + basketConfig.offsetY;
  const basketBase = Matter.Bodies.rectangle(
    basketBaseX,
    basketBaseY+20,
    basketConfig.width,
    basketConfig.height,
    {
      label: 'basketBase',
      render: { fillStyle: '#4B5563' },
      collisionFilter: { category: 0x0001, mask: 0xFFFF },
    }
  );
  const basketWallA = Matter.Bodies.rectangle(
    basketBaseX - basketConfig.width / 2 + basketConfig.wallThickness / 2,
    basketBaseY - basketConfig.wallHeight / 2,
    basketConfig.wallThickness,
    basketConfig.wallHeight+40,
    {
      label: 'basketWallA',
      render: { fillStyle: '#4B5563' },
      collisionFilter: { category: 0x0001, mask: 0xFFFF },
    }
  );
  const basketWallB = Matter.Bodies.rectangle(
    basketBaseX + basketConfig.width / 2 - basketConfig.wallThickness / 2,
    basketBaseY - basketConfig.wallHeight / 2,
    basketConfig.wallThickness,
    basketConfig.wallHeight+40,
    {
      label: 'basketWallB',
      render: { fillStyle: '#4B5563' },
      collisionFilter: { category: 0x0001, mask: 0xFFFF },
    }
  );

  // ─── 5) 레버+바구니 복합체 ───
  const lever = Matter.Body.create({
    parts: [plank, basketBase, basketWallA, basketWallB],
    label: 'lever',
    render: { visible: true },
    collisionFilter: { category: 0x0001, mask: 0xFFFF },
  });

  // ─── 6) 축(fulcrum) & 힌지 ───
  const hingeX = leverConfig.x;
  const hingeY = leverConfig.y;
  const fulcrum = Matter.Bodies.circle(hingeX, hingeY, 10, {
    isStatic: true,
    label: 'fulcrum',
    render: {
      fillStyle: 'rgba(0,0,0,0)',
      strokeStyle: '#fbbf24',
      lineWidth: 1,
    },
    collisionFilter: { group: -1, category: 0x0002, mask: 0x0000 },
  });
  const localHinge = { x: hingeX - lever.position.x, y: hingeY - lever.position.y };
  const pivot = Matter.Constraint.create({
    bodyA: lever,
    pointA: localHinge,
    bodyB: fulcrum,
    pointB: { x: 0, y: 0 },
    length: 0,
    stiffness: 1,
    render: { visible: false },
  });

  // ─── 7) 기타 플랫폼 & 목표 ───
  const rect1 = Matter.Bodies.rectangle(750, 320, 160, 20, { isStatic: true, label: 'rect1', render: { fillStyle: '#1e40af' }, collisionFilter: { category: 0x0001, mask: 0xFFFF } });
  const rect2 = Matter.Bodies.rectangle(65, 400, 20, 20, { isStatic: true, label: 'rect2', render: { fillStyle: '#1e40af' }, collisionFilter: { category: 0x0001, mask: 0xFFFF } });
  const rect3 = Matter.Bodies.rectangle(170, 260, 10, 20, { isStatic: true, label: 'rect3', render: { fillStyle: '#1e40af' }, collisionFilter: { category: 0x0001, mask: 0xFFFF } });
  const star = Matter.Bodies.trapezoid(780, 300, 20, 20, 1, { isStatic: true, label: 'balloon', render: { fillStyle: '#fbbf24' }, collisionFilter: { category: 0x0001, mask: 0x0001 } });

  // ─── 8) 움직이는 장애물 ───
  const movingObs = Matter.Bodies.rectangle(600, 225, 80, 250, { isStatic: true, label: 'movingObstacleRight', render: { fillStyle: '#dc2626' }, collisionFilter: { category: 0x0001, mask: 0xFFFF } });
  const movingObsLeft = Matter.Bodies.rectangle(500, 255, 80, 30, { isStatic: true, label: 'movingObstacleLeft', render: { fillStyle: '#dc2626' }, collisionFilter: { category: 0x0001, mask: 0xFFFF } });

  // ─── 9) 월드에 추가 ───
  Matter.World.add(world, [floor, ball, lever, fulcrum, pivot, rect1, rect2, rect3, star, movingObs, movingObsLeft]);

  // ─── 10) 장애물 애니메이션 ───
  let dir = 1;
  const topY = 200, bottomY = 400, step = 2;
  const mover = () => {
    const nextY = movingObs.position.y + step * dir;
    if (nextY > bottomY) dir = -1;
    else if (nextY < topY) dir = 1;
    const clampedY = Math.max(topY, Math.min(bottomY, movingObs.position.y + step * dir));
    Matter.Body.setPosition(movingObs, { x: movingObs.position.x, y: clampedY });
    Matter.Body.setPosition(movingObsLeft, { x: movingObsLeft.position.x, y: clampedY - 150 });
  };
  setInterval(mover, 1000 / 30);

  // ─── 11) 반환 ───
  return [floor, ball, lever, fulcrum, pivot, rect1, rect2, rect3, star, movingObs, movingObsLeft];
};