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
    { id: '1', title: 'Dealing with work stress', timestamp: '2 hours ago' },
    { id: '2', title: 'Morning anxiety thoughts', timestamp: 'Yesterday' },
    { id: '3', title: 'Relationship concerns', timestamp: '3 days ago' },
    { id: '4', title: 'Sleep issues discussion', timestamp: '1 week ago' },
  ]);

  const deleteChat = (id: string) => {
    setChatHistory(prev => prev.filter(chat => chat.id !== id));
  };

  const navItems = [
    { id: 'chat', label: 'Chat with NIRA', icon: MessageSquare },
    { id: 'journal', label: 'Journal', icon: BookOpen },
    { id: 'goals', label: 'Goals & Progress', icon: Target },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-80 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-r border-blue-100 dark:border-gray-700 flex flex-col transition-colors">
      <div className="p-6 border-b border-blue-100 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center">
            <MessageSquare className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Navigation</h2>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  currentView === item.id
                    ? 'bg-gradient-to-r from-blue-500 to-teal-500 text-white shadow-md'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700'
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
          <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
            Chat History
          </h3>
          <button
            className="p-1.5 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="New Chat"
          >
            <Plus className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </button>
        </div>

        <div className="space-y-2">
          {chatHistory.map((chat) => (
            <div
              key={chat.id}
              className="group flex items-start gap-2 p-3 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                  {chat.title}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {chat.timestamp}
                </p>
              </div>
              <button
                onClick={() => deleteChat(chat.id)}
                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-all"
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
