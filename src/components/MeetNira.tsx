import { Bot, User, Mic, Smile, ArrowRight, Heart } from 'lucide-react';
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
    <section className="py-24 px-6 bg-gradient-to-br from-paleblue-50/40 via-warm-white to-lavender-50/30 relative overflow-hidden">
      <div className="absolute top-20 right-10 w-32 h-32 opacity-10 animate-float">
        <Heart className="w-full h-full text-blush-300" />
      </div>

      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16 space-y-4 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-soft-gray">
            meet nira, your companion
          </h2>
          <p className="text-xl text-gentle-gray/70 max-w-2xl mx-auto font-serif italic">
            a gentle presence, here to hold space for you
          </p>
          <p className="text-sm text-gentle-gray/50 lowercase">
            your calm corner awaits
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <div className="relative z-10 bg-white/70 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-lavender-100/30 overflow-hidden">
              <div className="bg-gradient-to-r from-sage-400/90 via-lavender-300/80 to-mint-400/90 p-6 flex items-center justify-between backdrop-blur-sm">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/95 rounded-full flex items-center justify-center shadow-lg animate-pulse-gentle">
                    <Bot className="w-8 h-8 text-sage-500" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg tracking-wide">nira</h3>
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 bg-mint-200 rounded-full animate-pulse"></div>
                      <span className="text-white/90 text-sm lowercase">here with you</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 space-y-6 h-[450px] overflow-y-auto bg-gradient-to-b from-lavender-50/20 via-warm-white/50 to-paleblue-50/20">
                {messages.slice(0, visibleMessages).map((message, index) => (
                  <div
                    key={index}
                    className={`flex gap-4 animate-fade-in ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    <div className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${
                      message.type === 'bot'
                        ? 'bg-gradient-to-br from-sage-300/60 to-mint-300/60 backdrop-blur-sm'
                        : 'bg-gradient-to-br from-blush-300/70 to-lavender-300/60 backdrop-blur-sm'
                    }`}>
                      {message.type === 'bot' ? (
                        <Bot className="w-6 h-6 text-sage-700" strokeWidth={1.5} />
                      ) : (
                        <User className="w-6 h-6 text-blush-700" strokeWidth={1.5} />
                      )}
                    </div>
                    <div className={`max-w-[75%] ${message.type === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
                      <div className={`px-6 py-4 rounded-[1.5rem] ${
                        message.type === 'bot'
                          ? 'bg-white/80 backdrop-blur-sm text-soft-gray shadow-sm border border-lavender-100/40'
                          : 'bg-gradient-to-br from-blush-200/60 to-lavender-200/50 backdrop-blur-sm text-soft-gray'
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

              <div className="p-6 bg-white/60 backdrop-blur-md border-t border-lavender-100/40">
                <div className="flex items-center gap-3">
                  <button className="p-3 hover:bg-sage-50/60 rounded-full transition-all" title="voice input">
                    <Mic className="w-5 h-5 text-sage-500/70" strokeWidth={1.5} />
                  </button>
                  <button className="p-3 hover:bg-sage-50/60 rounded-full transition-all" title="add emoji">
                    <Smile className="w-5 h-5 text-sage-500/70" strokeWidth={1.5} />
                  </button>
                  <input
                    type="text"
                    placeholder="take your time... share what's on your mind"
                    className="flex-1 px-6 py-3.5 rounded-[2rem] border-2 border-sage-200/40 focus:outline-none focus:ring-2 focus:ring-lavender-300/40 focus:border-transparent transition-all text-sm text-soft-gray placeholder:text-gentle-gray/40 bg-white/80 backdrop-blur-sm lowercase"
                    disabled
                  />
                  <button className="w-12 h-12 bg-gradient-to-r from-sage-400 to-mint-400 text-white rounded-full hover:shadow-lg hover:scale-105 transition-all flex items-center justify-center flex-shrink-0">
                    <ArrowRight className="w-5 h-5" strokeWidth={2} />
                  </button>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-12 -right-12 w-80 h-80 bg-lavender-300/15 rounded-full blur-3xl animate-breathing"></div>
            <div className="absolute -top-12 -left-12 w-80 h-80 bg-mint-300/15 rounded-full blur-3xl animate-breathing" style={{ animationDelay: '3s' }}></div>
          </div>
        </div>

        <div className="text-center mt-12 text-gentle-gray/50 text-sm italic lowercase animate-pulse-gentle">
          you're doing great ✨
        </div>
      </div>
    </section>
  );
}
