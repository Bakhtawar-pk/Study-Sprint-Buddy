import React from 'react';
import { ArrowRight } from 'lucide-react';

interface LandingProps {
  onStart: () => void;
}

const Landing: React.FC<LandingProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 w-full max-w-5xl mx-auto">
      
      {/* Hero Section */}
      <div className="text-center space-y-8 mb-16 animate-slide-up relative z-10">
        <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 shadow-lg hover:scale-105 transition-transform cursor-default">
            <span className="text-xl">🤖</span>
            <span className="text-xs font-bold text-white uppercase tracking-wider">Your AI Study Buddy</span>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-extrabold text-white tracking-tight drop-shadow-lg">
          Study <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-300 to-pink-300">Sprint 🚀</span>
        </h1>
        
        <p className="text-xl text-blue-50 max-w-xl mx-auto font-medium leading-relaxed">
          Match with an AI buddy 👯‍♀️. Set the timer ⏱️. <br/> Get rewards 🎁. No distractions.
        </p>

        <button
          onClick={onStart}
          className="group relative inline-flex items-center justify-center px-10 py-6 text-xl font-bold text-indigo-900 bg-white rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.2)] hover:shadow-[0_20px_60px_rgba(255,255,255,0.4)] hover:-translate-y-1 transition-all duration-300"
        >
          <span className="mr-2">Let's Go!</span>
          <span className="group-hover:translate-x-1 transition-transform">👉</span>
        </button>
      </div>

      {/* Emoji Grid Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full animate-slide-up relative z-10" style={{ animationDelay: '0.2s' }}>
        
        {/* Card 1 */}
        <div className="relative group p-8 bg-white/10 backdrop-blur-md rounded-[2rem] border border-white/20 hover:bg-white/20 transition-all duration-300 text-center">
            <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">🤝</div>
            <h3 className="text-xl font-bold text-white mb-2">Accountability</h3>
            <p className="text-blue-100 text-sm">Get matched with a unique AI personality who keeps you honest.</p>
        </div>

        {/* Card 2 */}
        <div className="relative group p-8 bg-white/10 backdrop-blur-md rounded-[2rem] border border-white/20 hover:bg-white/20 transition-all duration-300 text-center">
            <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">⏳</div>
            <h3 className="text-xl font-bold text-white mb-2">Emoji Timer</h3>
            <p className="text-blue-100 text-sm">Interactive emoji timer that reacts to your progress in real-time.</p>
        </div>

        {/* Card 3 */}
        <div className="relative group p-8 bg-white/10 backdrop-blur-md rounded-[2rem] border border-white/20 hover:bg-white/20 transition-all duration-300 text-center">
            <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">✨</div>
            <h3 className="text-xl font-bold text-white mb-2">Fun Rewards</h3>
            <p className="text-blue-100 text-sm">Collect unique AI-generated stickers for every sprint you crush.</p>
        </div>

      </div>
    </div>
  );
};

export default Landing;
