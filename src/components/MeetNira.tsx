import { Bot, User, Mic, Smile, ArrowRight } from 'lucide-react';
import MoodIcon from './MoodIcon';
import { useState, useEffect } from 'react';

export default function MeetNira() {
  const [visibleMessages, setVisibleMessages] = useState(0);

  const messages = [
    { type: 'bot', text: "hi there 🌿 i'm nira — i'm here to listen, no rush." },
    { type: 'user', text: "i've been feeling pretty heavy lately..." },
    { type: 'bot', text: "i hear you. that sounds really tough. want to tell me what's been weighing on you?" },
    { type: 'user', text: "just everything... work, life, it all feels like too much" },
    { type: 'bot', text: "it's okay to feel that way. let's take this one step at a time, together 💙" }
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
    <section className="py-24 px-6 bg-gradient-to-b from-amber-100/30 via-warm-white to-amber-50/40 relative overflow-hidden">
      <div className="absolute top-1/4 right-16 w-20 h-20 opacity-35 animate-float">
        <MoodIcon mood="creative" />
      </div>

      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16 space-y-4 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-soft-gray">
            meet nira, your companion
          </h2>
          <p className="text-xl text-forest/70 max-w-2xl mx-auto font-serif italic">
            a gentle presence, here to hold space for you
          </p>
          <p className="text-sm text-forest/50 lowercase">
            your calm corner awaits
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <div className="relative z-10 bg-white/70 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-amber-200/30 overflow-hidden">
              <div className="bg-amber-700 p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg animate-pulse-gentle">
                    <Bot className="w-8 h-8 text-amber-700" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg tracking-wide">nira</h3>
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse"></div>
                      <span className="text-white/90 text-sm lowercase">here with you</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 space-y-6 h-[450px] overflow-y-auto bg-gradient-to-b from-amber-50/30 via-warm-white/50 to-amber-100/20">
                {messages.slice(0, visibleMessages).map((message, index) => (
                  <div
                    key={index}
                    className={`flex gap-4 animate-fade-in ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    <div className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${
                      message.type === 'bot'
                        ? 'bg-gradient-to-br from-amber-300/60 to-amber-200/60 backdrop-blur-sm'
                        : 'bg-gradient-to-br from-amber-400/70 to-amber-300/60 backdrop-blur-sm'
                    }`}>
                      {message.type === 'bot' ? (
                        <Bot className="w-6 h-6 text-amber-800" strokeWidth={1.5} />
                      ) : (
                        <User className="w-6 h-6 text-amber-800" strokeWidth={1.5} />
                      )}
                    </div>
                    <div className={`max-w-[75%] ${message.type === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
                      <div className={`px-6 py-4 rounded-[1.5rem] ${
                        message.type === 'bot'
                          ? 'bg-white/80 backdrop-blur-sm text-soft-gray shadow-sm border border-amber-200/40'
                          : 'bg-gradient-to-br from-amber-200/60 to-amber-100/50 backdrop-blur-sm text-soft-gray'
                      }`}>
                        <p className="text-sm leading-relaxed lowercase">{message.text}</p>
                      </div>
                      <span className="text-xs text-gentle-gray/40 mt-2 px-2 lowercase italic">
                        just now
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-6 bg-white/60 backdrop-blur-md border-t border-amber-200/40">
                <div className="flex items-center gap-3">
                  <button className="p-3 hover:bg-amber-50/60 rounded-full transition-all" title="voice input">
                    <Mic className="w-5 h-5 text-amber-600/70" strokeWidth={1.5} />
                  </button>
                  <button className="p-3 hover:bg-amber-50/60 rounded-full transition-all" title="add emoji">
                    <Smile className="w-5 h-5 text-amber-600/70" strokeWidth={1.5} />
                  </button>
                  <input
                    type="text"
                    placeholder="take your time... share what's on your mind"
                    className="flex-1 px-6 py-3.5 rounded-[2rem] border border-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-700/30 focus:border-amber-700 transition-all text-sm text-soft-gray placeholder:text-gentle-gray/50 bg-white lowercase"
                    disabled
                  />
                  <button className="w-12 h-12 bg-gradient-to-r from-amber-600 to-amber-400 text-white rounded-full hover:shadow-lg hover:scale-105 transition-all flex items-center justify-center flex-shrink-0">
                    <ArrowRight className="w-5 h-5" strokeWidth={2} />
                  </button>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-12 -right-12 w-80 h-80 bg-amber-300/20 rounded-full blur-3xl animate-breathing"></div>
            <div className="absolute -top-12 -left-12 w-80 h-80 bg-amber-400/20 rounded-full blur-3xl animate-breathing" style={{ animationDelay: '3s' }}></div>
          </div>
        </div>

        <div className="text-center mt-12 flex items-center justify-center gap-2 animate-pulse-gentle">
          <span className="text-amber-700/50 text-sm lowercase">you're doing great</span>
        </div>
      </div>
    </section>
  );
}
