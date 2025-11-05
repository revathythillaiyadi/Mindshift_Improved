import { QrCode, ArrowRight, Bot, User, Mic, Smile } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Hero() {
  const [email, setEmail] = useState('');
  const [visibleMessages, setVisibleMessages] = useState(0);
  const navigate = useNavigate();

  const messages = [
    { type: 'bot', text: "Hello! I'm NIRA - Neural Insight and Reframing Assistant. I'm your compassionate companion for mental wellness. How can I help you today?" },
    { type: 'user', text: "I feel overwhelmed with everything going on..." },
    { type: 'bot', text: "I hear you. Let's work through this together. What specifically feels most overwhelming right now?" },
    { type: 'user', text: "Work deadlines and personal life feel impossible to balance" }
  ];

  useEffect(() => {
    if (visibleMessages < messages.length) {
      const timer = setTimeout(() => {
        setVisibleMessages(prev => prev + 1);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [visibleMessages, messages.length]);

  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/signup');
  };

  return (
    <section className="pt-32 pb-20 px-6 bg-gradient-to-br from-white via-blue-50/30 to-teal-50/20 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors">
      <div className="container mx-auto max-w-7xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 dark:from-blue-400 dark:to-teal-400 bg-clip-text text-transparent leading-tight">
              Reframe your thoughts, Reshape your world...
            </h1>

            <p className="text-xl text-blue-800 dark:text-blue-200 leading-relaxed">
              Experience AI-powered thought reframing with NIRA, your compassionate companion for mental wellness.
              Reshape negative patterns and unlock your potential for lasting positive change.
            </p>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-blue-100 dark:border-gray-700 transition-colors">
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">Join the Waitlist</h3>
              <form onSubmit={handleWaitlistSubmit} className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-3 rounded-full border border-blue-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    required
                  />
                  <button
                    type="submit"
                    className="px-8 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all hover:shadow-lg font-medium flex items-center justify-center gap-2"
                  >
                    Get Started
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <div className="flex-1 border-t border-blue-200 dark:border-gray-600"></div>
                  <span className="text-sm text-blue-600 dark:text-blue-400">or scan QR code</span>
                  <div className="flex-1 border-t border-blue-200 dark:border-gray-600"></div>
                </div>
                <div className="flex justify-center">
                  <div className="p-4 bg-blue-50 dark:bg-gray-700 rounded-xl transition-colors">
                    <QrCode className="w-24 h-24 text-blue-600" />
                  </div>
                </div>
              </form>
            </div>
          </div>

          <div className="relative">
            <div className="relative z-10 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-blue-100 dark:border-gray-700 overflow-hidden transition-colors">
              <div className="bg-gradient-to-r from-blue-600 to-teal-600 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                    <Bot className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">NIRA</h3>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-blue-100 text-xs">Online</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-white/60 rounded-full"></div>
                  <div className="w-1.5 h-1.5 bg-white/60 rounded-full"></div>
                  <div className="w-1.5 h-1.5 bg-white/60 rounded-full"></div>
                </div>
              </div>

              <div className="p-6 space-y-4 h-96 overflow-y-auto bg-gradient-to-b from-blue-50/50 to-teal-50/30 dark:from-gray-900 dark:to-gray-800 transition-colors">
                {messages.slice(0, visibleMessages).map((message, index) => (
                  <div
                    key={index}
                    className={`flex gap-3 animate-fade-in ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.type === 'bot'
                        ? 'bg-gradient-to-br from-blue-500 to-teal-500'
                        : 'bg-gradient-to-br from-blue-600 to-blue-700'
                    }`}>
                      {message.type === 'bot' ? (
                        <Bot className="w-5 h-5 text-white" />
                      ) : (
                        <User className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <div className={`max-w-[75%] ${message.type === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
                      <div className={`px-4 py-3 rounded-2xl ${
                        message.type === 'bot'
                          ? 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 shadow-sm'
                          : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                      }`}>
                        <p className="text-sm leading-relaxed">{message.text}</p>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 px-2">
                        Just now
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-white dark:bg-gray-800 border-t border-blue-100 dark:border-gray-700 transition-colors">
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-full transition-colors" title="Voice input">
                    <Mic className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </button>
                  <button className="p-2 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-full transition-colors" title="Emoji picker">
                    <Smile className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </button>
                  <input
                    type="text"
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2.5 rounded-full border border-blue-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-sm"
                    disabled
                  />
                  <button className="w-10 h-10 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-full hover:shadow-lg transition-all flex items-center justify-center flex-shrink-0">
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 w-72 h-72 bg-teal-300/30 rounded-full blur-3xl"></div>
            <div className="absolute -top-6 -left-6 w-72 h-72 bg-blue-300/30 rounded-full blur-3xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
