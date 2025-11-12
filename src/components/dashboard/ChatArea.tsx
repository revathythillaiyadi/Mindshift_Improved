import { useState, useEffect, useRef } from 'react';
import { Bot, User, Mic, Smile, Send, Volume2, Brain } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'bot';
  text: string;
  timestamp: Date;
  isTyping?: boolean;
}

export default function ChatArea() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      text: "Hello! I'm NIRA - Neural Insight and Reframing Assistant. I'm your compassionate companion for mental wellness, here to help you reframe your thoughts and navigate your emotions. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
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
        }, 30);
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
      <div className="bg-gradient-to-r from-forest to-sage-600 p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg">
            <Brain className="w-8 h-8 text-forest" />
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
              className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md ${
                message.type === 'bot'
                  ? 'bg-gradient-to-br from-forest to-sage-600'
                  : 'bg-gradient-to-br from-beige-400 to-beige-500'
              }`}
            >
              {message.type === 'bot' ? (
                <Brain className="w-5 h-5 text-white" />
              ) : (
                <User className="w-5 h-5 text-white" />
              )}
            </div>
            <div className={`max-w-[65%] ${message.type === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-2`}>
              <div
                className={`px-6 py-4 rounded-2xl shadow-md ${
                  message.type === 'bot'
                    ? 'bg-sage-100 dark:bg-gray-700 text-forest dark:text-gray-100 border border-sage-200/50 dark:border-gray-600'
                    : 'bg-beige-100 dark:bg-beige-800 text-soft-gray dark:text-white border border-beige-200/50 dark:border-beige-700'
                }`}
              >
                <p className="text-base leading-relaxed">
                  {message.text}
                  {message.isTyping && <span className="animate-pulse ml-1">|</span>}
                </p>
              </div>
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
            className={`p-3.5 rounded-2xl transition-all shadow-md ${
              isRecording
                ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                : 'bg-gradient-to-br from-forest to-sage-600 hover:shadow-lg hover:scale-105'
            }`}
            title={isRecording ? 'Stop recording' : 'Voice input'}
          >
            <Mic className="w-6 h-6 text-white" />
          </button>

          <div className="flex-1 flex flex-col gap-3">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="share your thoughts with nira..."
              className="w-full px-6 py-4 rounded-2xl border border-sage-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-forest focus:border-transparent transition-colors text-base resize-none shadow-sm placeholder-sage-400 dark:placeholder-gray-500 lowercase"
              rows={2}
            />
            <div className="flex items-center justify-between px-3">
              <button
                className="p-2 hover:bg-sage-100 dark:hover:bg-gray-700 rounded-xl transition-all hover:scale-105"
                title="Emoji picker"
              >
                <Smile className="w-5 h-5 text-forest dark:text-sage-400" />
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
