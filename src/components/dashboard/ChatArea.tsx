import { useState, useEffect, useRef } from 'react';
import { Bot, User, Mic, Smile, Send, Volume2, Brain, Wind, Heart, Sparkles, AlertCircle, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Message {
  id: string;
  type: 'user' | 'bot';
  text: string;
  timestamp: Date;
  isTyping?: boolean;
}

export default function ChatArea() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [typingMessages, setTypingMessages] = useState<Set<string>>(new Set());
  const [isThinking, setIsThinking] = useState(false);
  const [showVoiceTooltip, setShowVoiceTooltip] = useState(() => {
    return !localStorage.getItem('voice-tooltip-seen');
  });
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!isInitialLoad) {
      scrollToBottom();
    }
  }, [messages, isInitialLoad]);

  useEffect(() => {
    const initialMessageId = '1';
    const fullText = "Hello! I'm NIRA - Neural Insight and Reframing Assistant. I'm your compassionate companion for mental wellness, here to help you reframe your thoughts and navigate your emotions. How can I help you today?";

    const initialMessage: Message = {
      id: initialMessageId,
      type: 'bot',
      text: '',
      timestamp: new Date(),
      isTyping: true,
    };

    setMessages([initialMessage]);
    setTypingMessages(new Set([initialMessageId]));

    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setMessages([{
          ...initialMessage,
          text: fullText.slice(0, currentIndex),
        }]);
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        setMessages([{
          ...initialMessage,
          text: fullText,
          isTyping: false,
        }]);
        setTypingMessages(new Set());
        setTimeout(() => setIsInitialLoad(false), 500);
      }
    }, 50);

    return () => clearInterval(typingInterval);
  }, []);

  const handleSendMessage = (messageText?: string) => {
    const textToSend = messageText || inputText;
    if (textToSend.trim() && !isThinking) {
      const newMessage: Message = {
        id: Date.now().toString(),
        type: 'user',
        text: textToSend,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, newMessage]);
      setInputText('');
      setIsThinking(true);

      setTimeout(() => {
        const botResponseId = (Date.now() + 1).toString();
        const fullText = "I hear you. Let's work through this together. Can you tell me more about what's on your mind?";

        const botResponse: Message = {
          id: botResponseId,
          type: 'bot',
          text: '',
          timestamp: new Date(),
          isTyping: true,
        };
        setMessages(prev => [...prev, botResponse]);
        setTypingMessages(prev => new Set(prev).add(botResponseId));

        let currentIndex = 0;
        const typingInterval = setInterval(() => {
          if (currentIndex <= fullText.length) {
            setMessages(prev =>
              prev.map(msg =>
                msg.id === botResponseId
                  ? { ...msg, text: fullText.slice(0, currentIndex) }
                  : msg
              )
            );
            currentIndex++;
          } else {
            clearInterval(typingInterval);
            setMessages(prev =>
              prev.map(msg =>
                msg.id === botResponseId
                  ? { ...msg, isTyping: false }
                  : msg
              )
            );
            setTypingMessages(prev => {
              const newSet = new Set(prev);
              newSet.delete(botResponseId);
              return newSet;
            });
            setIsThinking(false);
          }
        }, 50);
      }, 1500);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-full flex flex-col bg-warm-white dark:bg-[#141b26] rounded-2xl shadow-xl border border-sage-100/50 dark:border-[#283647] overflow-hidden transition-colors">
      <div className="bg-gradient-to-r from-[#187E5F] via-[#0B5844] to-[#187E5F] px-4 py-3 flex items-center justify-between shadow-md" style={{ backgroundSize: '200% 100%', animation: 'gradient-shift 3s ease-in-out' }}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 bg-white dark:bg-[#00FFC8] rounded-2xl flex items-center justify-center shadow-lg dark:shadow-[0_0_20px_rgba(0,255,200,0.6)] overflow-hidden ${isThinking ? 'animate-gentle-pulse' : ''}`} style={{ boxShadow: '0 0 16px rgba(24, 126, 95, 0.5)' }}>
            <img
              src="/Gemini_Generated_Image_jnzolrjnzolrjnzo.png"
              alt="NIRA Avatar"
              className="w-9 h-9 object-cover rounded-2xl"
            />
          </div>
          <div>
            <h3 className="text-white font-bold text-base">NIRA</h3>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-mint-400 dark:bg-[#00FFC8] rounded-full animate-gentle-pulse shadow-sm dark:shadow-[0_0_8px_rgba(0,255,200,0.8)]"></div>
              <span className="text-sage-100 text-xs">Here for you</span>
            </div>
          </div>
        </div>
        <button
          className="p-2 hover:bg-white/10 rounded-xl transition-all hover:scale-105"
          title="Audio settings"
        >
          <Volume2 className="w-4 h-4 text-white" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-gradient-to-b from-sage-50/30 via-warm-white to-mint-50/20 dark:from-[#0a0f16] dark:to-[#0a0f16] chat-background-pattern">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            {message.type === 'user' && (
              <div
                className="w-8 h-8 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md overflow-hidden bg-gradient-to-br from-beige-400 to-beige-500"
              >
                <User className="w-4 h-4 text-white" />
              </div>
            )}
            <div className={`max-w-[75%] ${message.type === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-2`}>
              {message.type === 'bot' && message.isTyping && message.text === '' && (
                <div className="flex items-center gap-2 px-4 py-3 bg-sage-100 dark:bg-[#141b26] rounded-2xl shadow-md border border-sage-200/50 dark:border-[#283647]">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-sage-600 dark:bg-[#00FFC8] rounded-full animate-thinking-dot" style={{ animationDelay: '0s' }}></span>
                    <span className="w-2 h-2 bg-sage-600 dark:bg-[#00FFC8] rounded-full animate-thinking-dot" style={{ animationDelay: '0.2s' }}></span>
                    <span className="w-2 h-2 bg-sage-600 dark:bg-[#00FFC8] rounded-full animate-thinking-dot" style={{ animationDelay: '0.4s' }}></span>
                  </div>
                  <span className="text-sm text-sage-600 dark:text-[#00FFC8]">NIRA is thinking...</span>
                </div>
              )}
              {(message.text || !message.isTyping) && (
                <div
                  className={`px-4 py-3 rounded-2xl ${
                    message.type === 'bot'
                      ? 'bg-[#D4EDE5] dark:bg-[#141b26] text-[#2c4943] dark:text-[#00FFC8] border border-[rgba(24,126,95,0.2)] dark:border-[#283647]'
                      : 'bg-beige-100 dark:bg-[#1c2533] text-soft-gray dark:text-white border border-beige-200/50 dark:border-[#283647]'
                  }`}
                  style={message.type === 'bot' ? { boxShadow: '0 2px 8px rgba(44, 73, 67, 0.08)' } : { boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)' }}
                >
                  <p className="text-sm leading-relaxed">
                    {message.text}
                    {message.isTyping && <span className="animate-pulse ml-1">|</span>}
                  </p>
                </div>
              )}
              <span className="text-xs text-sage-500 dark:text-[#B0BED0] px-1">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        {isThinking && messages.length > 0 && messages[messages.length - 1].type === 'user' && (
          <div className="flex gap-3">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 px-4 py-3 bg-sage-100 dark:bg-[#141b26] rounded-2xl shadow-md border border-sage-200/50 dark:border-[#283647]">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-sage-600 dark:bg-[#00FFC8] rounded-full animate-thinking-dot" style={{ animationDelay: '0s' }}></span>
                  <span className="w-2 h-2 bg-sage-600 dark:bg-[#00FFC8] rounded-full animate-thinking-dot" style={{ animationDelay: '0.2s' }}></span>
                  <span className="w-2 h-2 bg-sage-600 dark:bg-[#00FFC8] rounded-full animate-thinking-dot" style={{ animationDelay: '0.4s' }}></span>
                </div>
                <span className="text-sm text-sage-600 dark:text-[#00FFC8]">NIRA is thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="px-4 py-3 bg-white/90 dark:bg-[#141b26] border-t border-sage-100/50 dark:border-gray-700">
        <div className="flex items-end gap-2">
          <div className="relative">
            <button
              onClick={() => {
                setIsRecording(!isRecording);
                if (showVoiceTooltip) {
                  localStorage.setItem('voice-tooltip-seen', 'true');
                  setShowVoiceTooltip(false);
                }
              }}
              className={`w-11 h-11 rounded-2xl transition-all shadow-lg group relative flex items-center justify-center ${
                isRecording
                  ? 'bg-red-500 hover:bg-red-600'
                  : 'bg-gradient-to-br from-sage-600 to-mint-600 hover:shadow-xl'
              }`}
              style={!isRecording ? {
                animation: 'voice-glow-pulse 2s ease-in-out infinite'
              } : {}}
              title={isRecording ? 'Stop recording' : 'Speak your thoughts'}
            >
              <Mic className="w-5 h-5 text-white" />
              {isRecording && (
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-0.5">
                  <div className="w-1 bg-white rounded-full animate-waveform-1" style={{ height: '12px' }}></div>
                  <div className="w-1 bg-white rounded-full animate-waveform-2" style={{ height: '16px' }}></div>
                  <div className="w-1 bg-white rounded-full animate-waveform-3" style={{ height: '20px' }}></div>
                  <div className="w-1 bg-white rounded-full animate-waveform-2" style={{ height: '16px' }}></div>
                  <div className="w-1 bg-white rounded-full animate-waveform-1" style={{ height: '12px' }}></div>
                </div>
              )}
              {!isRecording && showVoiceTooltip && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#187E5F]/95 text-white px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap pointer-events-none"></div>
              )}
            </button>
          </div>

          <div className="flex-1 flex flex-col gap-2">
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              <button
                onClick={() => handleSendMessage("I'm feeling anxious right now...")}
                disabled={isThinking}
                className="px-4 py-2 h-8 bg-blue-100 dark:bg-[#1c2533] text-blue-700 dark:text-[#F0F4F8] rounded-full text-xs font-medium hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center gap-2 flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <AlertCircle className="w-4 h-4" />
                <span>Feeling anxious</span>
              </button>
              <button
                onClick={() => handleSendMessage("I need a breathing exercise...")}
                disabled={isThinking}
                className="px-4 py-2 h-8 bg-teal-100 dark:bg-[#1c2533] text-teal-700 dark:text-[#00FFC8] rounded-full text-xs font-medium hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center gap-2 flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Wind className="w-4 h-4" />
                <span>Breathing Exercise</span>
              </button>
              <button
                onClick={() => handleSendMessage("I need support...")}
                disabled={isThinking}
                className="px-4 py-2 h-8 bg-rose-100 dark:bg-[#1c2533] text-rose-700 dark:text-[#F0F4F8] rounded-full text-xs font-medium hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center gap-2 flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Heart className="w-4 h-4" />
                <span>Need Support</span>
              </button>
            </div>
            <div className="relative">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={isThinking ? "NIRA is thinking..." : "Share your thoughts with NIRA..."}
                disabled={isThinking}
                className="w-full px-4 py-3 pr-12 rounded-2xl border border-sage-300 dark:border-[#283647] dark:bg-[#141b26] dark:text-white focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent transition-all text-[15px] resize-none shadow-sm placeholder-[#78968b] dark:placeholder-[#B0BED0] disabled:opacity-60 disabled:cursor-not-allowed"
                rows={1}
                style={{ minHeight: '44px' }}
              />
              <button
                className="absolute right-3 bottom-3 p-1.5 hover:bg-[rgba(24,126,95,0.1)] dark:hover:bg-gray-700 rounded-lg transition-all group"
                title="Add emoji"
              >
                <Smile className="w-4 h-4 text-[#187E5F] dark:text-[#00FFC8]" />
              </button>
            </div>
          </div>

          <button
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim() || isThinking}
            className={`w-11 h-11 rounded-2xl hover:shadow-lg transition-all disabled:cursor-not-allowed shadow-md flex items-center justify-center ${
              inputText.trim() && !isThinking
                ? 'bg-gradient-to-br from-[#187E5F] to-[#66887f] hover:scale-105 opacity-100'
                : 'bg-[#66887f] opacity-50'
            }`}
            title="Send message"
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>

        <div
          onClick={() => navigate('/dashboard?tab=journal')}
          className="mt-3 bg-[#F8FAF9] dark:bg-[#1c2533] rounded-lg px-3 py-2 cursor-pointer hover:bg-[#E8F5F0] dark:hover:bg-[#2d3e52] transition-all duration-200"
        >
          <div className="flex items-center justify-center gap-2">
            <BookOpen className="w-3.5 h-3.5 text-[#2c4943] dark:text-[#00FFC8]" />
            <span className="text-xs text-[#2c4943] dark:text-[#F0F4F8]">
              Want to reflect deeper? <span className="font-semibold text-[#187E5F] dark:text-[#00FFC8]">Start a journal entry.</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
