import { MessageSquare, BookOpen, Settings, Target, Trash2, Plus } from 'lucide-react';
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
    <aside className="w-80 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl flex flex-col transition-colors">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-sage-500 to-mint-500 rounded-[1rem] flex items-center justify-center">
            <MessageSquare className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-lg font-semibold text-forest dark:text-sage-100 lowercase">navigation</h2>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-[1rem] transition-all lowercase ${
                  currentView === item.id
                    ? 'bg-gradient-to-r from-sage-500 to-mint-500 text-white shadow-lg'
                    : 'text-soft-gray dark:text-gray-300 hover:bg-sage-50 dark:hover:bg-gray-700'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-sage-600 dark:text-gray-400 uppercase tracking-wide">
            chat history
          </h3>
          <button
            className="p-1.5 hover:bg-sage-50 dark:hover:bg-gray-700 rounded-[0.75rem] transition-colors"
            title="New Chat"
          >
            <Plus className="w-4 h-4 text-sage-600 dark:text-sage-400" />
          </button>
        </div>

        <div className="space-y-2">
          {chatHistory.map((chat) => (
            <div
              key={chat.id}
              className="group flex items-start gap-2 p-3 rounded-[1rem] hover:bg-sage-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-forest dark:text-gray-200 truncate lowercase">
                  {chat.title}
                </p>
                <p className="text-xs text-sage-600 dark:text-gray-400 mt-1 lowercase">
                  {chat.timestamp}
                </p>
              </div>
              <button
                onClick={() => deleteChat(chat.id)}
                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-[0.75rem] transition-all"
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
