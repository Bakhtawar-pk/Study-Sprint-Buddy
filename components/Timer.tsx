import React, { useState, useEffect } from 'react';

interface TimerProps {
  durationSeconds: number;
  timeLeft: number;
  isActive: boolean;
}

const Timer: React.FC<TimerProps> = ({ durationSeconds, timeLeft, isActive }) => {
  const [isBlinking, setIsBlinking] = useState(false);
  const [isPoked, setIsPoked] = useState(false);
  const [wiggle, setWiggle] = useState(false);

  const percentage = Math.min(100, Math.max(0, (timeLeft / durationSeconds) * 100));
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formatTime = (t: number) => t.toString().padStart(2, '0');

  // Random Blink Logic
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance to blink every interval
        setIsBlinking(true);
        setTimeout(() => setIsBlinking(false), 200);
      }
    }, 2000);
    return () => clearInterval(blinkInterval);
  }, []);

  // Determine Emoji Face based on progress
  const getEmoji = () => {
    if (isPoked) return '😵'; // Dizzy if poked
    if (!isActive && timeLeft < durationSeconds && timeLeft > 0) return '😴'; // Sleeping if paused mid-way
    if (!isActive && timeLeft === durationSeconds) return '😎'; // Cool start
    if (timeLeft === 0) return '🥳'; // Party done

    // Active States
    if (percentage > 75) return '🤓'; // Studious start
    if (percentage > 40) return '🧐'; // Focused
    if (percentage > 15) return '😅'; // Sweat drop
    return '🥵'; // Sweating hot / intense
  };

  const handlePoke = () => {
    if (timeLeft === 0) return;
    setIsPoked(true);
    setWiggle(true);
    // Reset poke state
    setTimeout(() => setIsPoked(false), 1000);
    setTimeout(() => setWiggle(false), 500);
  };

  // SVG Circle Calc
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center justify-center">
      {/* Progress Ring */}
      <div className="relative w-80 h-80">
         <svg className="w-full h-full transform -rotate-90">
          {/* Track */}
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="15"
            fill="transparent"
          />
          {/* Indicator */}
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            stroke={percentage < 20 ? '#ef4444' : '#8b5cf6'} // Red if low time, else Purple
            strokeWidth="15"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-linear"
          />
        </svg>

        {/* The Giant Emoji */}
        <div 
            className={`absolute inset-0 flex items-center justify-center cursor-pointer select-none transition-transform active:scale-95 ${wiggle ? 'animate-shake' : ''}`}
            onClick={handlePoke}
        >
            <div 
                className={`text-[9rem] leading-none filter drop-shadow-2xl transition-all duration-200 ${isBlinking ? 'scale-y-[0.1]' : 'scale-y-100'}`}
                style={{ transformOrigin: 'center' }}
            >
                {getEmoji()}
            </div>
        </div>
        
        {/* Helper tooltip */}
        <div className="absolute -bottom-8 left-0 right-0 text-center opacity-60">
             <span className="bg-white/20 text-white text-[10px] px-2 py-1 rounded-full backdrop-blur-sm">
                {isActive ? 'Click me!' : 'Ready?'}
             </span>
        </div>
      </div>
      
      {/* Digital Time */}
      <div className="mt-4 flex flex-col items-center">
          <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200 drop-shadow-sm font-mono tracking-tighter">
            {formatTime(minutes)}:{formatTime(seconds)}
          </div>
          <div className="text-white/60 text-sm font-bold uppercase tracking-widest mt-1">
             {isActive ? 'Stay Focused' : 'Paused'}
          </div>
      </div>

    </div>
  );
};

export default Timer;
