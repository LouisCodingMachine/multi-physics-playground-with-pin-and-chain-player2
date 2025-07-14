import Matter from 'matter-js';
import type { LevelFactory } from './index';

export const createLevel10: LevelFactory = (world) => {
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

  // 1) 첫 번째 상자
  const floor1 = Matter.Bodies.rectangle(350, 450, 120, 50, {
    isStatic: true,
    label: 'floor1',
    render: { fillStyle: '#10b981' },
    collisionFilter: { category: 0x0001, mask: 0xFFFF, group: -10 },
  });

  // 2) 두 번째 상자
  const floor2 = Matter.Bodies.rectangle(570, 550, 120, 200, {
    isStatic: true,
    label: 'floor2',
    render: { fillStyle: '#10b981' },
    collisionFilter: { category: 0x0001, mask: 0xFFFF },
  });

  // 3) 세 번째 상자
  const floor3 = Matter.Bodies.rectangle(710, 550, 160, 300, {
    isStatic: true,
    label: 'floor3',
    render: { fillStyle: '#10b981' },
    collisionFilter: { category: 0x0001, mask: 0xFFFF },
  });

  // 3-2) 공 튀김 방지 상자
  const safeBox = Matter.Bodies.rectangle(810, 380, 40, 450, {
    isStatic: true,
    label: 'safe_box',
    render: { fillStyle: '#10b981' },
    collisionFilter: { category: 0x0001, mask: 0xFFFF },
  });

  const hingeGroup = -10; // 독립된 고유 그룹 번호

  // 4) 힌지 달린 상자
  const hingeBox = Matter.Bodies.rectangle(350, 60, 150, 100, {
    isStatic: true,
    label: 'hingeBox',
    frictionAir: 0,
    friction: 0,
    frictionStatic: 0,
    render: { fillStyle: '#10b981' },
    collisionFilter: { category: 0x0002, mask: 0x0001, group: hingeGroup },
  });

  // 5) 힌지 축 생성
  const nail15_0 = Matter.Bodies.circle(
    hingeBox.position.x,
    hingeBox.position.y,
    10,
    {
      isStatic: true,
      label: 'nail',
      collisionFilter: {
        category: 0x0002,
        mask: 0x0001,
        group: hingeGroup,
      },
      render: {
        fillStyle: 'rgba(0,0,0,0)',
        strokeStyle: '#fbbf24',
        lineWidth: 3,
      },
    }
  );

  // 6) 제약 조건 설정
  const pivot15 = Matter.Constraint.create({
    bodyA: hingeBox,
    pointA: { x: 0, y: 0 },
    bodyB: nail15_0,
    pointB: { x: 0, y: 0 },
    length: 0,
    stiffness: 1,
    damping: 0,
    render: { visible: false },
  });

  // 7) 공 및 별 생성
  const ball = Matter.Bodies.circle(350, 400, 15, {
    label: 'ball',
    restitution: 1,
    frictionAir: 0,
    friction: 0,
    render: { fillStyle: '#ef4444' },
    collisionFilter: { category: 0x0001, mask: 0xFFFF },
  });

  const star = Matter.Bodies.trapezoid(720, 390, 20, 20, 1, {
    isStatic: true,
    label: 'balloon',
    render: { fillStyle: '#fbbf24' },
    collisionFilter: { category: 0x0001, mask: 0x0001 },
  });

  // 8) 월드에 바디 추가
  Matter.World.add(world, [
    ...walls,
    floor1,
    floor2,
    floor3,
    safeBox,
    hingeBox,
    nail15_0,
    pivot15,
    ball,
    star,
  ]);

  // 9) 힌지 상자와 축 애니메이션 (상하 이동)
  let dir = 1;
  const topY = 100;
  const bottomY = 250;
  const step = 2;
  const mover = () => {
    const nextY = hingeBox.position.y + step * dir;
    if (nextY > bottomY) dir = -1;
    else if (nextY < topY) dir = 1;
    const deltaY = step * dir;
    Matter.Body.translate(hingeBox, { x: 0, y: deltaY });
    Matter.Body.translate(nail15_0, { x: 0, y: deltaY });
  };
  setInterval(mover, 1000 / 30);

  // 10) 반환
  return [
    ...walls,
    floor1,
    floor2,
    floor3,
    safeBox,
    hingeBox,
    nail15_0,
    pivot15,
    ball,
    star,
  ];
};