import React, { useState, useRef, useEffect } from 'react';
import { Message, Buddy, AppStage } from '../types';
import { Send, Sparkles } from 'lucide-react';

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
  buddy: Buddy;
  stage: AppStage;
  className?: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, onSendMessage, buddy, stage, className }) => {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const text = input;
    setInput('');
    setIsSending(true);
    await onSendMessage(text);
    setIsSending(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={`flex flex-col h-full bg-white/60 backdrop-blur-xl border-l border-white/20 shadow-2xl ${className}`}>
      
      {/* Glass Header */}
      <div className="p-4 border-b border-white/20 flex items-center space-x-4 bg-white/40">
        <div className="relative group cursor-pointer">
          <div className="w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr from-indigo-500 to-pink-500 shadow-lg group-hover:scale-105 transition-transform">
            <div className="w-full h-full rounded-full border-2 border-white overflow-hidden">
                <img src={buddy.avatarUrl} alt={buddy.name} className="w-full h-full object-cover" />
            </div>
          </div>
          <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-400 border-2 border-white rounded-full animate-pulse"></div>
        </div>
        <div>
          <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
            {buddy.name} <Sparkles size={14} className="text-yellow-500" />
          </h3>
          <p className="text-xs text-slate-500 font-medium tracking-wide uppercase">
            {stage === AppStage.SPRINTING ? 'Focus Mode On' : 'Active Buddy'}
          </p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-hide" ref={scrollRef}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-pop-in`}
          >
            <div className={`flex flex-col max-w-[80%] ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
              
              {/* Sender Name (Tiny) */}
              {msg.sender !== 'user' && msg.sender !== 'system' && (
                  <span className="text-[10px] text-slate-400 mb-1 ml-2">{buddy.name}</span>
              )}

              <div
                className={`relative px-5 py-3 text-sm leading-relaxed shadow-sm transform transition-all hover:scale-[1.02] ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-br from-indigo-600 to-violet-600 text-white rounded-2xl rounded-tr-sm'
                    : msg.sender === 'system' 
                        ? 'bg-slate-100/80 text-slate-500 text-center w-full italic text-xs py-2 rounded-xl border border-slate-200'
                        : 'bg-white text-slate-700 border border-slate-100 rounded-2xl rounded-tl-sm shadow-md'
                }`}
              >
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        
        {isSending && (
           <div className="flex justify-start w-full animate-pulse">
              <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm border border-slate-100 flex gap-1">
                 <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                 <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75"></div>
                 <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></div>
              </div>
           </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white/40 border-t border-white/20 backdrop-blur-md">
        <div className="flex items-center space-x-2 bg-white rounded-full px-2 py-2 shadow-inner border border-slate-200 focus-within:ring-2 focus-within:ring-indigo-400 transition-all">
          <input
            type="text"
            className="flex-1 bg-transparent border-none outline-none text-sm text-slate-700 placeholder:text-slate-400 px-3"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isSending}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isSending}
            className="p-2.5 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:rotate-12"
          >
            <Send size={16} fill="white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
