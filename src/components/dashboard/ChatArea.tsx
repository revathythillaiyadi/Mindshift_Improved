import { useState, useEffect, useRef } from 'react';
import { Bot, User, Mic, Smile, Send, Volume2 } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'bot';
  text: string;
  timestamp: Date;
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
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          text: "I hear you. Let's work through this together. Can you tell me more about what's on your mind?",
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, botResponse]);
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
    <div className="h-full flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-blue-100 dark:border-gray-700 overflow-hidden transition-colors">
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
        <button
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          title="Audio settings"
        >
          <Volume2 className="w-5 h-5 text-white" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-blue-50/30 to-teal-50/20 dark:from-gray-900 dark:to-gray-800">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.type === 'bot'
                  ? 'bg-gradient-to-br from-blue-500 to-teal-500'
                  : 'bg-gradient-to-br from-blue-600 to-blue-700'
              }`}
            >
              {message.type === 'bot' ? (
                <Bot className="w-5 h-5 text-white" />
              ) : (
                <User className="w-5 h-5 text-white" />
              )}
            </div>
            <div className={`max-w-[70%] ${message.type === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
              <div
                className={`px-4 py-3 rounded-2xl ${
                  message.type === 'bot'
                    ? 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 shadow-sm'
                    : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                }`}
              >
                <p className="text-sm leading-relaxed">{message.text}</p>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 px-2">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white dark:bg-gray-800 border-t border-blue-100 dark:border-gray-700">
        <div className="flex items-end gap-2">
          <button
            onClick={() => setIsRecording(!isRecording)}
            className={`p-3 rounded-full transition-all ${
              isRecording
                ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                : 'bg-gradient-to-r from-blue-600 to-teal-600 hover:shadow-lg'
            }`}
            title={isRecording ? 'Stop recording' : 'Voice input'}
          >
            <Mic className="w-6 h-6 text-white" />
          </button>

          <div className="flex-1 flex flex-col gap-2">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="w-full px-4 py-3 rounded-2xl border border-blue-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-sm resize-none"
              rows={2}
            />
            <div className="flex items-center justify-between px-2">
              <button
                className="p-2 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title="Emoji picker"
              >
                <Smile className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </button>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Press Enter to send
              </span>
            </div>
          </div>

          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim()}
            className="p-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-full hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            title="Send message"
          >
            <Send className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
