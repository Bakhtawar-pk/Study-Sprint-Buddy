import React from 'react';
import { ArrowRight, Clock, Users, Award, Zap } from 'lucide-react';

interface LandingProps {
  onStart: () => void;
}

const Landing: React.FC<LandingProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 w-full max-w-5xl mx-auto">
      
      {/* Hero Section */}
      <div className="text-center space-y-6 mb-16 animate-slide-up">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 shadow-lg">
            <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-xs font-bold text-white uppercase tracking-wider">AI Accountability Partner</span>
        </div>
        
        <h1 className="text-6xl md:text-7xl font-extrabold text-white tracking-tight drop-shadow-sm">
          Focus. Sprint. <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300">Crush It.</span>
        </h1>
        
        <p className="text-xl text-blue-100 max-w-xl mx-auto font-light">
          Study Sprint Buddy pairs you with an AI companion for intense 25-minute work sprints. No distractions. Just progress.
        </p>

        <button
          onClick={onStart}
          className="group relative inline-flex items-center justify-center px-8 py-5 text-lg font-bold text-indigo-900 bg-white rounded-full shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] hover:scale-105 transition-all duration-300"
        >
          <span>Start a Sprint</span>
          <ArrowRight className="w-5 h-5 ml-2 transition-transform duration-200 group-hover:translate-x-1" />
        </button>
      </div>

      {/* Bento Grid Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full animate-slide-up" style={{ animationDelay: '0.2s' }}>
        
        {/* Card 1 */}
        <div className="relative group p-6 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 hover:bg-white/20 transition-all duration-300 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl group-hover:bg-purple-500/30 transition-all"></div>
            <Users className="w-10 h-10 text-purple-300 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Smart Matching</h3>
            <p className="text-blue-100 text-sm">Instantly paired with an AI personality tailored to your work style.</p>
        </div>

        {/* Card 2 */}
        <div className="relative group p-6 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 hover:bg-white/20 transition-all duration-300 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/20 rounded-full blur-2xl group-hover:bg-cyan-500/30 transition-all"></div>
            <Clock className="w-10 h-10 text-cyan-300 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Liquid Timer</h3>
            <p className="text-blue-100 text-sm">Visually satisfying countdowns that keep you in the flow state.</p>
        </div>

        {/* Card 3 */}
        <div className="relative group p-6 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 hover:bg-white/20 transition-all duration-300 overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/20 rounded-full blur-2xl group-hover:bg-pink-500/30 transition-all"></div>
            <Award className="w-10 h-10 text-pink-300 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Gen-AI Rewards</h3>
            <p className="text-blue-100 text-sm">Earn unique, procedurally generated stickers for every completed task.</p>
        </div>

      </div>
    </div>
  );
};

export default Landing;
