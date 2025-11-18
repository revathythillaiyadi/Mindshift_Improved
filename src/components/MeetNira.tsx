import { Bot, User, Mic, Smile, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import TreeRing from './TreeRing';

export default function MeetNira() {
  const [visibleMessages, setVisibleMessages] = useState(0);

  const messages = [
    { type: 'bot', text: "Hello there 🌿 i'm NIRA — i'm here to listen, no rush." },
    { type: 'user', text: "I've been feeling pretty heavy lately..." },
    { type: 'bot', text: "I hear you. that sounds really tough. want to tell me what's been weighing on you?" },
    { type: 'user', text: "Just everything... work, life, it all feels like too much" },
    { type: 'bot', text: "It's okay to feel that way. let's take this one step at a time, together 💙" }
  ];

  useEffect(() => {
    if (visibleMessages < messages.length) {
      const timer = setTimeout(() => {
        setVisibleMessages(prev => prev + 1);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [visibleMessages, messages.length]);

  return (
    <section className="py-12 px-6 bg-gradient-to-b from-mint-50/20 via-warm-white to-sage-50/30 dark:from-[#0a0f16] dark:via-[#0a0f16] dark:to-[#0a0f16] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <TreeRing
          ringCount={10}
          className="absolute top-1/4 right-16 w-[220px] h-[220px] opacity-35 animate-breathing"
          style={{ animationDelay: '2s' }}
        />
      </div>

      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16 space-y-4 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-soft-gray dark:text-white transition-colors">
            Meet NIRA, Your Companion
          </h2>
          <p className="text-xl text-forest/70 dark:text-white max-w-2xl mx-auto font-serif italic">
            A gentle presence, here to hold space for you.
          </p>
          <p className="text-sm text-forest/50 dark:text-[#F0F4F8]">
            Your calm corner awaits.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <div className="relative z-10 bg-white/70 dark:bg-[#141b26] backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-lavender-100/30 dark:border-[#283647] overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-500 to-mint-500 dark:from-emerald-600 dark:to-mint-600 p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg animate-pulse-gentle">
                    <Bot className="w-8 h-8 text-emerald-600 transition-colors" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg tracking-wide">NIRA</h3>
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.8)]"></div>
                      <span className="text-white/90 text-sm">Here with you</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 space-y-6 h-[450px] overflow-y-auto bg-white/90 dark:from-[#0a0f16] dark:via-[#0a0f16] dark:to-[#0a0f16]">
                {messages.slice(0, visibleMessages).map((message, index) => (
                  <div
                    key={index}
                    className={`flex gap-4 animate-fade-in ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    <div className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${
                      message.type === 'bot'
                        ? 'bg-gradient-to-br from-sage-300/60 to-mint-300/60 dark:bg-emerald-500 backdrop-blur-sm dark:shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                        : 'bg-gradient-to-br from-mint-300/70 to-sage-300/60 dark:bg-[#1c2533] backdrop-blur-sm'
                    }`}>
                      {message.type === 'bot' ? (
                        <Bot className="w-6 h-6 text-sage-700 dark:text-white" strokeWidth={1.5} />
                      ) : (
                        <User className="w-6 h-6 text-sage-700 dark:text-white" strokeWidth={1.5} />
                      )}
                    </div>
                    <div className={`max-w-[75%] ${message.type === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
                      <div className={`px-6 py-4 rounded-[1.5rem] ${
                        message.type === 'bot'
                          ? 'bg-white/80 dark:bg-[#141b26] backdrop-blur-sm text-soft-gray dark:text-emerald-400 shadow-sm border border-lavender-100/40 dark:border-emerald-400/30 dark:shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                          : 'bg-gradient-to-br from-mint-200/60 to-sage-200/50 dark:bg-[#1c2533] backdrop-blur-sm text-soft-gray dark:text-white border dark:border-[#283647]'
                      }`}>
                        <p className="text-sm leading-relaxed">{message.text}</p>
                      </div>
                      <span className="text-xs text-gentle-gray/40 dark:text-[#B0BED0] mt-2 px-2 italic">
                        Just now
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-6 bg-gradient-to-r from-emerald-500 to-mint-500 dark:from-emerald-600 dark:to-mint-600 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <button className="p-3 hover:bg-white/20 rounded-full transition-all" title="voice input">
                    <Mic className="w-5 h-5 text-white" strokeWidth={1.5} />
                  </button>
                  <button className="p-3 hover:bg-white/20 rounded-full transition-all" title="add emoji">
                    <Smile className="w-5 h-5 text-white" strokeWidth={1.5} />
                  </button>
                  <input
                    type="text"
                    placeholder="Take your time... share what's on your mind"
                    className="flex-1 px-6 py-3.5 rounded-[2rem] border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white transition-all text-sm text-white placeholder:text-white/70 bg-white/20"
                    disabled
                  />
                  <button className="w-12 h-12 bg-white text-emerald-600 rounded-full hover:shadow-lg hover:scale-105 transition-all flex items-center justify-center flex-shrink-0">
                    <ArrowRight className="w-5 h-5" strokeWidth={2} />
                  </button>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-12 -right-12 w-80 h-80 bg-mint-300/20 rounded-full blur-3xl animate-breathing"></div>
            <div className="absolute -top-12 -left-12 w-80 h-80 bg-sage-300/20 rounded-full blur-3xl animate-breathing" style={{ animationDelay: '3s' }}></div>
          </div>
        </div>

        <div className="text-center mt-12 flex items-center justify-center gap-2 animate-pulse-gentle">
          <span className="text-forest/50 dark:text-white text-sm">You're doing great.</span>
        </div>
      </div>
    </section>
  );
}
