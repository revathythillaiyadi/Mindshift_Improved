import { MessageSquare, BookOpen, Settings, Target, Trash2, Plus, Brain } from 'lucide-react';
import { useState } from 'react';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: 'chat' | 'journal' | 'settings' | 'goals') => void;
}

interface ChatSession {
  id: string;
  title: string;
  timestamp: string;
}

export default function Sidebar({ currentView, onViewChange }: SidebarProps) {
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([
    { id: '1', title: 'dealing with work stress', timestamp: '2 hours ago' },
    { id: '2', title: 'morning anxiety thoughts', timestamp: 'yesterday' },
    { id: '3', title: 'relationship concerns', timestamp: '3 days ago' },
    { id: '4', title: 'sleep issues discussion', timestamp: '1 week ago' },
  ]);

  const deleteChat = (id: string) => {
    setChatHistory(prev => prev.filter(chat => chat.id !== id));
  };

  const navItems = [
    { id: 'chat', label: 'chat with nira', icon: MessageSquare },
    { id: 'journal', label: 'journal', icon: BookOpen },
    { id: 'goals', label: 'goals & progress', icon: Target },
    { id: 'settings', label: 'settings', icon: Settings },
  ];

  return (
    <aside className="w-80 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl flex flex-col transition-colors border-r border-sage-100/50 dark:border-gray-700">
      <div className="p-8 border-b border-sage-100/50 dark:border-gray-700">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-[#FF9F9B] to-[#FFD4C4] rounded-2xl flex items-center justify-center shadow-lg">
            <Brain className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-xl bg-gradient-to-r from-[#FF9F9B] to-[#FFD4C4] bg-clip-text text-transparent dark:text-white lowercase">mindshift</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 lowercase">your companion</p>
          </div>
        </div>

        <h3 className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold mb-4 px-4 lowercase">
          navigation
        </h3>

        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id as any)}
                className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all lowercase relative group ${
                  currentView === item.id
                    ? 'bg-gradient-to-r from-[#FFF5F0] to-[#FFE8DC] dark:bg-gray-700 text-[#FF9F9B] dark:text-white font-semibold shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-[#FFFBF5] dark:hover:bg-gray-700/50 hover:text-[#FF9F9B] dark:hover:text-white'
                }`}
              >
                {currentView === item.id && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-[#FF9F9B] to-[#FFD4C4] dark:bg-[#FFD4C4] rounded-r-full" />
                )}
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="text-base">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-base font-semibold text-gray-800 dark:text-white lowercase">
            recent conversations
          </h3>
          <button
            className="p-2 hover:bg-[#FFF5F0] dark:hover:bg-gray-700 rounded-xl transition-all hover:scale-105"
            title="New Chat"
          >
            <Plus className="w-5 h-5 text-[#FF9F9B] dark:text-[#FFD4C4]" />
          </button>
        </div>

        <div className="space-y-3">
          {chatHistory.map((chat, index) => (
            <div
              key={chat.id}
              className="group flex items-start gap-3 p-4 rounded-2xl hover:bg-gradient-to-r hover:from-[#FFFBF5] hover:to-[#FFF9F5] dark:hover:bg-gray-700 transition-all duration-300 cursor-pointer animate-chat-slide-fade hover:translate-x-1 hover:shadow-md"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex-1 min-w-0">
                <p className="text-base font-medium text-gray-800 dark:text-gray-200 truncate lowercase">
                  {chat.title}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 lowercase">
                  {chat.timestamp}
                </p>
              </div>
              <button
                onClick={() => deleteChat(chat.id)}
                className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-[#FFE8E8] dark:hover:bg-red-900/20 rounded-xl transition-all"
                title="Delete chat"
              >
                <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
