import { useState, useEffect, useRef } from 'react';
import { Bot, User, Mic, Smile, Send, Volume2, Brain, Wind, Heart, Sparkles, AlertCircle } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'bot';
  text: string;
  timestamp: Date;
  isTyping?: boolean;
}

export default function ChatArea() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [typingMessages, setTypingMessages] = useState<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
      }
    }, 50);

    return () => clearInterval(typingInterval);
  }, []);

  const handleSendMessage = () => {
    if (inputText.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        type: 'user',
        text: inputText,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, newMessage]);
      setInputText('');

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
          }
        }, 50);
      }, 1000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-full flex flex-col bg-warm-white dark:bg-gray-800 rounded-2xl shadow-xl border border-sage-100/50 dark:border-gray-700 overflow-hidden transition-colors">
      <div className="bg-gradient-to-r from-[#187E5F] via-[#0B5844] to-[#187E5F] p-6 flex items-center justify-between shadow-md" style={{ backgroundSize: '200% 100%', animation: 'gradient-shift 3s ease-in-out' }}>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg overflow-hidden" style={{ boxShadow: '0 0 16px rgba(24, 126, 95, 0.5)' }}>
            <img
              src="/Gemini_Generated_Image_jnzolrjnzolrjnzo.png"
              alt="NIRA Avatar"
              className="w-12 h-12 object-cover rounded-2xl"
            />
          </div>
          <div>
            <h3 className="text-white font-bold text-lg lowercase">nira</h3>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-mint-400 rounded-full animate-gentle-pulse shadow-sm"></div>
              <span className="text-sage-100 text-sm lowercase">here for you</span>
            </div>
          </div>
        </div>
        <button
          className="p-2.5 hover:bg-white/10 rounded-xl transition-all hover:scale-105"
          title="Audio settings"
        >
          <Volume2 className="w-5 h-5 text-white" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-gradient-to-b from-sage-50/30 via-warm-white to-mint-50/20 dark:from-gray-900 dark:to-gray-800">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-4 ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md overflow-hidden ${
                message.type === 'bot'
                  ? 'bg-white mr-3'
                  : 'bg-gradient-to-br from-beige-400 to-beige-500 ml-3'
              }`}
              style={message.type === 'bot' ? { boxShadow: '0 0 16px rgba(24, 126, 95, 0.5)' } : {}}
            >
              {message.type === 'bot' ? (
                <img
                  src="/Gemini_Generated_Image_jnzolrjnzolrjnzo.png"
                  alt="NIRA"
                  className={`w-9 h-9 object-cover rounded-2xl ${message.isTyping ? 'animate-avatar-thinking' : ''}`}
                />
              ) : (
                <User className="w-5 h-5 text-white" />
              )}
            </div>
            <div className={`max-w-[65%] ${message.type === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-2`}>
              {message.type === 'bot' && message.isTyping && message.text === '' && (
                <div className="flex items-center gap-2 px-6 py-4 bg-sage-100 dark:bg-gray-700 rounded-2xl shadow-md border border-sage-200/50 dark:border-gray-600">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-sage-600 dark:bg-sage-400 rounded-full animate-thinking-dot" style={{ animationDelay: '0s' }}></span>
                    <span className="w-2 h-2 bg-sage-600 dark:bg-sage-400 rounded-full animate-thinking-dot" style={{ animationDelay: '0.2s' }}></span>
                    <span className="w-2 h-2 bg-sage-600 dark:bg-sage-400 rounded-full animate-thinking-dot" style={{ animationDelay: '0.4s' }}></span>
                  </div>
                  <span className="text-sm text-sage-600 dark:text-sage-400">NIRA is thinking...</span>
                </div>
              )}
              {(message.text || !message.isTyping) && (
                <div
                  className={`px-6 py-4 rounded-2xl ${
                    message.type === 'bot'
                      ? 'bg-[#D4EDE5] dark:bg-gray-700 text-[#2c4943] dark:text-gray-100 border border-[rgba(24,126,95,0.2)] dark:border-gray-600'
                      : 'bg-beige-100 dark:bg-beige-800 text-soft-gray dark:text-white border border-beige-200/50 dark:border-beige-700'
                  }`}
                  style={message.type === 'bot' ? { boxShadow: '0 2px 8px rgba(44, 73, 67, 0.08)' } : { boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)' }}
                >
                  <p className="text-base leading-relaxed">
                    {message.text}
                    {message.isTyping && <span className="animate-pulse ml-1">|</span>}
                  </p>
                </div>
              )}
              <span className="text-xs text-sage-500 dark:text-gray-400 px-3">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-6 bg-white/90 dark:bg-gray-800 border-t border-sage-100/50 dark:border-gray-700">
        <div className="flex items-end gap-3">
          <button
            onClick={() => setIsRecording(!isRecording)}
            className={`p-5 rounded-2xl transition-all shadow-lg group relative ${
              isRecording
                ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                : 'bg-gradient-to-br from-sage-600 to-mint-600 hover:shadow-xl hover:scale-110 animate-gentle-pulse'
            }`}
            title={isRecording ? 'Stop recording' : 'Speak your thoughts'}
          >
            <Mic className="w-8 h-8 text-white" />
            {!isRecording && (
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-xs text-sage-600 dark:text-sage-400 whitespace-nowrap bg-white dark:bg-gray-700 px-2 py-1 rounded shadow-md">
                Speak your thoughts
              </span>
            )}
          </button>

          <div className="flex-1 flex flex-col gap-3">
            <div className="flex gap-2 mb-1">
              <button
                onClick={() => setInputText("I'm feeling anxious right now...")}
                className="px-3 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium hover:shadow-md hover:scale-105 transition-all flex items-center gap-1.5"
              >
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Feeling anxious</span>
              </button>
              <button
                onClick={() => setInputText("I need a breathing exercise...")}
                className="px-3 py-2 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded-full text-xs font-medium hover:shadow-md hover:scale-105 transition-all flex items-center gap-1.5"
              >
                <Wind className="w-3.5 h-3.5" />
                <span>Breathing exercise</span>
              </button>
              <button
                onClick={() => setInputText("I need support...")}
                className="px-3 py-2 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 rounded-full text-xs font-medium hover:shadow-md hover:scale-105 transition-all flex items-center gap-1.5"
              >
                <Heart className="w-3.5 h-3.5" />
                <span>Need support</span>
              </button>
              <button
                onClick={() => setInputText("I want to share something I'm grateful for...")}
                className="px-3 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs font-medium hover:shadow-md hover:scale-105 transition-all flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Gratitude</span>
              </button>
            </div>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="share your thoughts with nira..."
              className="w-full px-6 py-4 rounded-2xl border border-sage-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent transition-all text-base resize-none shadow-sm placeholder-sage-400 dark:placeholder-gray-500 lowercase"
              rows={2}
            />
            <div className="flex items-center justify-between px-3">
              <button
                className="p-2 hover:bg-sage-100 dark:hover:bg-gray-700 rounded-xl transition-all hover:scale-105"
                title="Emoji picker"
              >
                <Smile className="w-5 h-5 text-sage-600 dark:text-sage-400" />
              </button>
              <span className="text-xs text-sage-500 dark:text-gray-400 lowercase">
                press enter to send
              </span>
            </div>
          </div>

          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim()}
            className="p-3.5 bg-gradient-to-br from-forest to-sage-600 text-white rounded-2xl hover:shadow-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 shadow-md"
            title="Send message"
          >
            <Send className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
