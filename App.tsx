import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AppStage, Message, Buddy, BUDDY_NAMES, BUDDY_PERSONALITIES, SprintSession } from './types';
import Landing from './components/Landing';
import Timer from './components/Timer';
import ChatInterface from './components/ChatInterface';
import { generateBuddyResponse, generateRewardSticker, analyzeSprintSession } from './services/geminiService';
import { ArrowLeft, CheckCircle2, RefreshCcw, Download, Sparkles, X, Trophy } from 'lucide-react';

const SPRINT_DURATION = 25 * 60; 

export default function App() {
  const [stage, setStage] = useState<AppStage>(AppStage.LANDING);
  const [buddy, setBuddy] = useState<Buddy | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentTask, setCurrentTask] = useState('');
  const [timeLeft, setTimeLeft] = useState(SPRINT_DURATION);
  const [isActive, setIsActive] = useState(false);
  const [sessionData, setSessionData] = useState<SprintSession | null>(null);
  const [isGeneratingReward, setIsGeneratingReward] = useState(false);
  
  const timerRef = useRef<number | null>(null);

  const addMessage = useCallback((text: string, sender: 'user' | 'buddy' | 'system') => {
    const newMessage: Message = {
      id: Date.now().toString() + Math.random().toString(),
      text,
      sender,
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, newMessage]);
  }, []);

  const handleStart = () => {
    setStage(AppStage.MATCHING);
    // Gamified Matching Delay
    setTimeout(() => {
      const randomName = BUDDY_NAMES[Math.floor(Math.random() * BUDDY_NAMES.length)];
      const randomPersonality = BUDDY_PERSONALITIES[Math.floor(Math.random() * BUDDY_PERSONALITIES.length)];
      const newBuddy: Buddy = {
        id: 'buddy-1',
        name: randomName,
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${randomName}&backgroundColor=b6e3f4`,
        personality: randomPersonality
      };
      setBuddy(newBuddy);
      setStage(AppStage.PLANNING);
      
      const introMsg: Message = {
        id: 'init-1',
        sender: 'buddy',
        text: `Hey! I'm ${newBuddy.name}. Ready to get stuff done? What are we working on?`,
        timestamp: Date.now()
      };
      setMessages([introMsg]);
    }, 3500);
  };

  const handleSendMessage = async (text: string) => {
    addMessage(text, 'user');
    if (!buddy) return;

    try {
      const response = await generateBuddyResponse(
        [...messages, { id: 'temp', sender: 'user', text, timestamp: Date.now() }],
        buddy,
        currentTask || text,
        stage as 'PLANNING' | 'SPRINTING' | 'COMPLETED'
      );
      addMessage(response, 'buddy');

      if (stage === AppStage.PLANNING && !currentTask) {
        setCurrentTask(text);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const startSprint = () => {
    if (!currentTask) {
        addMessage("Wait! Tell me your task first.", "system");
        return;
    }
    setStage(AppStage.SPRINTING);
    setIsActive(true);
    addMessage("Timer is ON! Head down, focus up. I'll see you in 25 mins.", "system");
  };

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      if (timerRef.current) clearInterval(timerRef.current);
      setIsActive(false);
      handleSprintComplete();
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isActive, timeLeft]);

  const handleSprintComplete = async () => {
    setStage(AppStage.COMPLETED);
    if (buddy) {
       const congrats = await analyzeSprintSession(currentTask, 25);
       addMessage(`We did it! ${congrats}`, 'buddy');
    }
  };

  const handleGenerateReward = async () => {
    if (isGeneratingReward || sessionData?.rewardImageUrl) return;
    setIsGeneratingReward(true);
    const imageUrl = await generateRewardSticker(currentTask);
    
    setSessionData({
        id: Date.now().toString(),
        task: currentTask,
        durationMinutes: 25,
        completedAt: Date.now(),
        rewardImageUrl: imageUrl || undefined
    });
    setIsGeneratingReward(false);
  };

  const resetApp = () => {
    setStage(AppStage.LANDING);
    setMessages([]);
    setBuddy(null);
    setCurrentTask('');
    setTimeLeft(SPRINT_DURATION);
    setIsActive(false);
    setSessionData(null);
  };

  // --- RENDER ---

  // 1. Landing (handled by component, but wrapper is here)
  if (stage === AppStage.LANDING) {
    return (
        <div className="h-screen w-screen overflow-hidden relative">
            {/* Animated Background Orbs */}
            <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute top-20 right-20 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" style={{animationDelay: '2s'}}></div>
            <div className="absolute -bottom-8 left-40 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" style={{animationDelay: '4s'}}></div>
            <div className="absolute z-10 w-full h-full bg-white/10 backdrop-blur-[2px]">
                <Landing onStart={handleStart} />
            </div>
        </div>
    );
  }

  // 2. Matching Screen
  if (stage === AppStage.MATCHING) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-900 relative overflow-hidden">
        {/* Radar Effect */}
        <div className="absolute w-[500px] h-[500px] border border-green-500/30 rounded-full flex items-center justify-center">
             <div className="w-full h-full rounded-full animate-radar bg-gradient-to-r from-transparent via-green-500/10 to-transparent absolute top-0 left-0"></div>
             <div className="w-[350px] h-[350px] border border-green-500/30 rounded-full"></div>
             <div className="w-[200px] h-[200px] border border-green-500/30 rounded-full"></div>
        </div>
        
        <div className="z-10 flex flex-col items-center space-y-6">
            <div className="w-24 h-24 bg-black rounded-full border-2 border-green-500 flex items-center justify-center relative shadow-[0_0_30px_rgba(34,197,94,0.4)]">
                <span className="text-4xl animate-pulse">🤖</span>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-ping"></div>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-widest uppercase font-mono">Scanning Network...</h2>
            <div className="flex gap-1">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce delay-100"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce delay-200"></div>
            </div>
        </div>
      </div>
    );
  }

  // 3. Main App Layout (Split Screen)
  return (
    <div className="h-screen w-screen flex flex-col md:flex-row overflow-hidden relative">
      
      {/* Dynamic background for the whole app */}
      <div className="absolute inset-0 z-0 pointer-events-none">
         <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-400/30 rounded-full blur-[100px]"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-400/30 rounded-full blur-[100px]"></div>
      </div>

      {/* MOBILE HEADER */}
      <div className="md:hidden h-16 bg-white/80 backdrop-blur-md border-b border-white/20 flex items-center px-4 justify-between shrink-0 z-50 sticky top-0">
         <div className="font-bold text-slate-800 flex items-center gap-2">
            <Sparkles size={18} className="text-indigo-500" />
            <span>SprintBuddy</span>
         </div>
         {stage === AppStage.SPRINTING && (
             <div className="text-sm font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">
                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
             </div>
         )}
      </div>

      {/* LEFT PANEL: WORKSPACE */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
        
        {stage === AppStage.PLANNING && (
            <div className="w-full max-w-md bg-white/40 backdrop-blur-xl border border-white/40 p-8 rounded-[2rem] shadow-xl animate-pop-in relative">
                <button onClick={resetApp} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600"><X size={20}/></button>
                <div className="text-center mb-8">
                   <h2 className="text-3xl font-bold text-slate-800 mb-2">Goal Setting</h2>
                   <p className="text-slate-500">What's the one thing you want to achieve?</p>
                </div>
                
                <div className="space-y-4">
                    <input 
                        type="text" 
                        value={currentTask} 
                        onChange={(e) => setCurrentTask(e.target.value)}
                        placeholder="e.g. Write 500 words of essay..."
                        className="w-full text-xl p-4 bg-white/70 border border-white/50 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:outline-none transition-all placeholder:text-slate-400 text-center text-slate-700 shadow-inner"
                    />
                    <button 
                        onClick={startSprint}
                        disabled={!currentTask}
                        className="w-full py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-indigo-500/30 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Start Sprint
                    </button>
                </div>
            </div>
        )}

        {stage === AppStage.SPRINTING && (
            <div className="flex flex-col items-center space-y-10 w-full animate-slide-up">
                <Timer durationSeconds={SPRINT_DURATION} timeLeft={timeLeft} isActive={isActive} />
                
                <div className="bg-white/30 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 shadow-sm text-center">
                    <h3 className="text-sm font-bold text-slate-600 uppercase tracking-widest mb-1">Current Focus</h3>
                    <p className="text-lg font-medium text-slate-800">{currentTask}</p>
                </div>

                <button 
                    onClick={() => { if(window.confirm("Abort mission?")) resetApp(); }}
                    className="text-xs font-bold text-slate-400 hover:text-red-500 transition-colors uppercase tracking-widest border-b border-transparent hover:border-red-500"
                >
                    Abandon Sprint
                </button>
            </div>
        )}

        {stage === AppStage.COMPLETED && (
             <div className="w-full max-w-md bg-white/60 backdrop-blur-xl border border-white/50 p-8 rounded-[2.5rem] shadow-2xl animate-pop-in text-center">
                 <div className="inline-flex items-center justify-center p-4 bg-green-100 rounded-full mb-6 shadow-inner">
                    <Trophy className="w-10 h-10 text-green-600" />
                 </div>
                 <h2 className="text-3xl font-extrabold text-slate-800 mb-2">Sprint Crushed!</h2>
                 <p className="text-slate-600 mb-8">You stayed focused for 25 minutes.</p>

                 {/* Reward Card */}
                 <div 
                    className="relative group bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-1 shadow-xl mb-8 overflow-hidden cursor-pointer transform hover:scale-[1.02] transition-all duration-300"
                    onClick={handleGenerateReward}
                 >
                     <div className="bg-white rounded-[1.3rem] h-64 flex flex-col items-center justify-center relative overflow-hidden">
                        {!sessionData?.rewardImageUrl ? (
                             <>
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                                <Sparkles className={`w-12 h-12 text-indigo-400 mb-4 ${isGeneratingReward ? 'animate-spin' : ''}`} />
                                <h3 className="text-lg font-bold text-slate-700">Tap to Reveal Reward</h3>
                                <p className="text-xs text-slate-400 mt-2">AI Generated Collectible</p>
                             </>
                        ) : (
                            <div className="relative w-full h-full flex flex-col items-center justify-center bg-slate-50 animate-pop-in">
                                 <img src={sessionData.rewardImageUrl} alt="Reward" className="w-48 h-48 object-contain drop-shadow-xl" />
                                 <a 
                                    href={sessionData.rewardImageUrl} 
                                    download="sticker.png"
                                    onClick={(e) => e.stopPropagation()}
                                    className="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow-md hover:bg-slate-100 text-slate-700"
                                 >
                                    <Download size={16} />
                                 </a>
                            </div>
                        )}
                     </div>
                 </div>

                 <button 
                    onClick={resetApp}
                    className="w-full py-3 bg-white border-2 border-slate-100 text-slate-700 rounded-2xl font-bold hover:bg-slate-50 hover:border-slate-200 transition-colors flex items-center justify-center gap-2"
                >
                    <RefreshCcw size={18} /> New Session
                 </button>
             </div>
        )}
      </div>

      {/* RIGHT PANEL: CHAT */}
      <div className="w-full md:w-[400px] h-[40vh] md:h-full shrink-0 z-20">
        {buddy && (
            <ChatInterface 
                messages={messages} 
                onSendMessage={handleSendMessage} 
                buddy={buddy} 
                stage={stage}
            />
        )}
      </div>
    </div>
  );
}