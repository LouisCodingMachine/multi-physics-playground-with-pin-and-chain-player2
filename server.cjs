// server.cjs
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const Matter = require('matter-js');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

// ——————————————————————————
// Matter.js 엔진 및 러너 설정
// ——————————————————————————
const engine = Matter.Engine.create();
const runner = Matter.Runner.create();
Matter.Runner.run(runner, engine);

// ——————————————————————————
// 게임 상태 관리
// ——————————————————————————
let currentTurn = 'player1';    // player1 또는 player2
let currentLevel = 1;           // 1 ~ TOTAL_LEVELS
const completedLevels = new Set();

// ——————————————————————————
// 물리 상태 주기적 브로드캐스트
// ——————————————————————————
setInterval(() => {
  const world = engine.world;
  const ball = world.bodies.find(b => b.label === 'ball');
  if (!ball) return;

  // 동적 바디만
  const dynamicBodies = world.bodies
    .filter(b => !b.isStatic && b.label !== 'balloon')
    .map(b => ({
      id:              b.label,
      position:        b.position,
      velocity:        b.velocity,
      angle:           b.angle,
      angularVelocity: b.angularVelocity
    }));

  io.emit('stateSnapshot', {
    timestamp: Date.now(),
    ball: {
      position: ball.position,
      velocity: ball.velocity
    },
    bodies: dynamicBodies
  });
}, 50);

// ——————————————————————————
// 클라이언트 소켓 핸들러
// ——————————————————————————
io.on('connection', socket => {
  console.log('Client connected:', socket.id);

  // 처음 접속 시 현재 턴/레벨/완료 레벨 정보 전송
  socket.emit('updateTurn',      { currentTurn });
  socket.emit('changeLevel',     { level: currentLevel });
  socket.emit('completedLevelsResponse', { levels: [...completedLevels] });

  // 클라이언트 요청 핸들러
  socket.on('getTurn', () => {
    socket.emit('updateTurn', { currentTurn });
  });

  socket.on('getCompletedLevels', () => {
    socket.emit('completedLevelsResponse', { levels: [...completedLevels] });
  });

  // 턴 전환 요청
  socket.on('changeTurn', ({ nextPlayerId }) => {
    currentTurn = nextPlayerId;
    io.emit('updateTurn', { currentTurn });
    console.log(`Turn -> ${currentTurn}`);
  });

  // 레벨 변경 요청
  socket.on('changeLevel', ({ level, playerId }) => {
    currentLevel = level;
    io.emit('changeLevel', { level, playerId });
    console.log(`Level -> ${level} by ${playerId}`);
  });

  // 레벨 리셋 요청
  socket.on('resetLevel', ({ level }) => {
    // Matter 월드 초기화
    Matter.World.clear(engine.world, false);
    Matter.Engine.clear(engine);
    currentLevel = level;
    io.emit('resetLevel', { level });
    console.log(`Reset -> level ${level}`);
  });

  // 레벨 완료 처리
  socket.on('completeLevel', ({ completedLevel, playerId }) => {
    completedLevels.add(completedLevel);
    io.emit('completedLevelsUpdated', { levels: [...completedLevels] });
    console.log(`Complete -> level ${completedLevel} by ${playerId}`);
  });

  // 그 외 모든 게임 이벤트는 브로드캐스트만
  const relayEvents = [
  'push',
  'drawShape',
  'drawPin',
  'erase',            // 이제 발신자도 받습니다
  'changeTool',
  'createChain',
  'changeHingePosition',
  'mouseMove'
];

relayEvents.forEach(evt => {
  socket.on(evt, data => {
    // socket.broadcast.emit ➔ io.emit 으로 전환
    io.emit(evt, data);
  });
});

  relayEvents.forEach(evt => {
    socket.on(evt, data => {
      socket.broadcast.emit(evt, data);
    });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// ——————————————————————————
// 서버 시작
// ——————————————————————————
const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
