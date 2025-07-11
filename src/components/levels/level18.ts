// src/levels/level18.ts
import Matter from 'matter-js'
import type { LevelFactory } from './index'

export const createLevel18: LevelFactory = (world) => {
  // ─── 바닥 ───
  const floor = Matter.Bodies.rectangle(400, 610, 810, 20, {
    isStatic: true,
    label: 'wall_bottom',
    render: { fillStyle: '#94a3b8' },
    collisionFilter: { category: 0x0001, mask: 0xFFFF },
  })

  // ─── 공 (작은 힘에도 빠르게 움직이도록 restitution 과 density 조정) ───
  const ball = Matter.Bodies.circle(50, 220, 15, {
    label: 'ball',
    frictionAir: 0,      // 공기 저항 제거
    friction: 0,         // 표면 마찰 제거
    render: { fillStyle: '#ef4444' },
    collisionFilter: { category: 0x0001, mask: 0xFFFF },
  })

  // ─── 지렛대 + 피벗 ───
  const lever = Matter.Bodies.rectangle(165, 220, 350, 20, {
    label: 'lever',
    render: { fillStyle: '#4B0082' },
    collisionFilter: { group: -1, category: 0x0002, mask: 0xFFFF & ~0x0002 },
  })
  const pivot = Matter.Bodies.circle(lever.position.x + 20, 280, 10, {
    isStatic: true,
    label: 'nail8_0',
    render: {
      fillStyle: 'rgba(0,0,0,0)',
      strokeStyle: '#fbbf24',
      lineWidth: 3,
    },
    collisionFilter: { group: -1, category: 0x0002, mask: 0x0000 },
  })
  const leverConstraint = Matter.Constraint.create({
    bodyA: lever,
    pointA: { x: 0, y: 0 },
    bodyB: pivot,
    pointB: { x: 0, y: 0 },
    length: 0,
    stiffness: 1,
    render: { visible: false },
  })

  // ─── 중간 플랫폼 ───
  const rect1 = Matter.Bodies.rectangle(700, 320, 100, 20, {
    isStatic: true,
    label: 'rect1',
    render: { fillStyle: '#1e40af' },
    collisionFilter: { category: 0x0001, mask: 0xFFFF },
  })
  const rect2 = Matter.Bodies.rectangle(20, 300, 20, 20, {
    isStatic: true,
    label: 'rect2',
    render: { fillStyle: '#1e40af' },
    collisionFilter: { category: 0x0001, mask: 0xFFFF },
  })

  // ─── 목표 별(balloon) ───
  const star = Matter.Bodies.trapezoid(750, 300, 20, 20, 1, {
    render: { fillStyle: '#fbbf24' },
    label: 'balloon',
    isStatic: true,
    collisionFilter: { category: 0x0001, mask: 0x0001 },
  })

  // ─── 위아래 이동 장애물 (static) ───
  const movingObs = Matter.Bodies.rectangle(700, 225, 80, 80, {
    isStatic: true,
    label: 'movingObstacle',
    render: { fillStyle: '#dc2626' },
    collisionFilter: { category: 0x0001, mask: 0xFFFF },
  })

  // ─── 월드에 추가 ───
  Matter.World.add(world, [
    floor,
    ball,
    lever,
    pivot,
    leverConstraint,
    rect1,
    rect2,
    star,
    movingObs,
  ])

  // ─── 수동 애니메이션: setInterval로 위아래 왕복 ───
  let dir = 1
  const topY    = 0
  const bottomY = 270
  const step    = 2

  const mover = () => {
    const nextY = movingObs.position.y + step * dir
    if (nextY > bottomY) dir = -1
    else if (nextY < topY) dir = 1
    const clampedY = Math.max(topY, Math.min(bottomY, movingObs.position.y + step * dir))
    Matter.Body.setPosition(movingObs, { x: movingObs.position.x, y: clampedY })
  }

  setInterval(mover, 1000 / 60) // 약 60fps

  return [
    floor,
    ball,
    lever,
    pivot,
    rect1,
    rect2,
    star,
    movingObs,
  ]
}
