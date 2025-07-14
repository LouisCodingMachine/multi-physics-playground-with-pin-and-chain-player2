// src/App.tsx
import React from 'react';
import PhysicsCanvas from './components/PhysicsCanvas';
import { SocketProvider } from './context/SocketContext';

function App() {
  // ❗️ 이 값만 바꿔서 각 클라이언트마다 플레이어1(true)/플레이어2(false)로 설정하세요.
  // const isPlayerOne = true; // → 플레이어1으로 동작
  const isPlayerOne = false; // → 플레이어2로 동작

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
      <SocketProvider>
        {/* PhysicsCanvas 에 한 줄만 prop 추가 */}
        <PhysicsCanvas isPlayerOne={isPlayerOne} />
      </SocketProvider>
    </div>
  );
}

export default App;
