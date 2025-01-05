import React, { useState, useEffect } from 'react';

interface TimerProps {
  startTimer: boolean;
  onFinish: () => void;
}

const Timer: React.FC<TimerProps> = ({ startTimer, onFinish }) => {
  const [timeLeft, setTimeLeft] = useState<number>(20 * 60); // 20분
//   const [timeLeft, setTimeLeft] = useState<number>(10); // 10초

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (startTimer) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            onFinish(); // 타이머 종료 시 콜백 호출
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [startTimer, onFinish]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="absolute top-4 left-4 bg-gray-800 text-white p-2 rounded shadow-lg">
      {formatTime(timeLeft)}
    </div>
  );
};

export default Timer;