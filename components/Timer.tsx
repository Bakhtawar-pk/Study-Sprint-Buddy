import React from 'react';

interface TimerProps {
  durationSeconds: number;
  timeLeft: number;
  isActive: boolean;
}

const Timer: React.FC<TimerProps> = ({ durationSeconds, timeLeft, isActive }) => {
  const percentage = Math.min(100, Math.max(0, (timeLeft / durationSeconds) * 100));
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formatTime = (t: number) => t.toString().padStart(2, '0');

  // Dynamic color based on progress
  let liquidColor = 'bg-blue-500';
  if (percentage < 30) liquidColor = 'bg-red-500';
  else if (percentage < 60) liquidColor = 'bg-purple-500';

  return (
    <div className="relative flex flex-col items-center justify-center">
      {/* Outer Glass Container */}
      <div className="relative w-72 h-72 rounded-full border-4 border-white/30 bg-white/10 backdrop-blur-sm shadow-[0_0_50px_rgba(255,255,255,0.2)] overflow-hidden">
        
        {/* Inner Liquid */}
        <div 
            className={`absolute bottom-0 left-0 w-full transition-all duration-1000 ease-in-out ${liquidColor}`}
            style={{ height: `${percentage}%` }}
        >
            {/* The Wave Surface Animation */}
            <div className="absolute -top-6 left-0 w-[200%] h-12 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMjAwIDEyMCIgcHJlc2VydmVBc3BlY3RSYXRpbz0ibm9uZSI+PHBhdGggZD0iTTMyMS4zOSw1Ni40NGM1OC0xMC43OSwxMTQuMTYtMzAuMTMsMTcyLTQxLjg2LDgyLjM5LTE2LjcyLDE2OC4xOS0xNy43MywyNTAuNDUtLjM5QzgyMy43OCwzMSw5MDYuNjcsNzIsOTg1LjY2LDkyLjgzYzcwLjA1LDE4LjQ4LDE0Ni41MywyNi4wOSwyMTQuMzQsM1YwaC0xMjAwdjI3LjM1QzExMi44MSwzOS4wOSwyMjguMjgsNTguMjUsMzIxLjM5LDU2LjQ0WiIgZmlsbD0iI2ZmZmZmZiIgZmlsbC1vcGFjaXR5PSIwLjMiLz48L3N2Zz4=')] bg-repeat-x bg-[length:50%_100%] animate-wave"></div>
            
            {/* Second offset wave for depth */}
            <div className="absolute -top-4 left-0 w-[200%] h-12 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMjAwIDEyMCIgcHJlc2VydmVBc3BlY3RSYXRpbz0ibm9uZSI+PHBhdGggZD0iTTMyMS4zOSw1Ni40NGM1OC0xMC43OSwxMTQuMTYtMzAuMTMsMTcyLTQxLjg2LDgyLjM5LTE2LjcyLDE2OC4xOS0xNy43MywyNTAuNDUtLjM5QzgyMy43OCwzMSw5MDYuNjcsNzIsOTg1LjY2LDkyLjgzYzcwLjA1LDE4LjQ4LDE0Ni41MywyNi4wOSwyMTQuMzQsM1YwaC0xMjAwdjI3LjM1QzExMi44MSwzOS4wOSwyMjguMjgsNTguMjUsMzIxLjM5LDU2LjQ0WiIgZmlsbD0iI2ZmZmZmZiIgZmlsbC1vcGFjaXR5PSIwLjMiLz48L3N2Zz4=')] bg-repeat-x bg-[length:50%_100%] animate-wave opacity-60" style={{ animationDuration: '7s', animationDirection: 'reverse' }}></div>
        </div>

        {/* Shine/Reflection Overlay */}
        <div className="absolute top-4 left-4 w-16 h-8 bg-white/20 rounded-full rotate-[-45deg] blur-md"></div>
        <div className="absolute bottom-6 right-6 w-10 h-10 bg-white/10 rounded-full blur-xl"></div>

        {/* Time Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 drop-shadow-md">
          <span className={`text-6xl font-bold tracking-tight transition-colors duration-300 ${percentage > 50 ? 'text-slate-800' : 'text-white'}`}>
            {formatTime(minutes)}:{formatTime(seconds)}
          </span>
          <span className={`text-sm font-bold uppercase tracking-widest mt-2 ${percentage > 50 ? 'text-slate-500' : 'text-blue-100'}`}>
            {isActive ? 'Sprint Active' : 'Paused'}
          </span>
        </div>
      </div>
      
      {/* Outer Glow */}
      {isActive && (
        <div className="absolute w-64 h-64 bg-white rounded-full opacity-10 animate-ping -z-10"></div>
      )}
    </div>
  );
};

export default Timer;
