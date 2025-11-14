import { MessageSquare, BookOpen, Settings, Target, Trash2, Plus, Brain, Search, Pin } from 'lucide-react';
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
    { id: '1', title: 'dealing with work stress and burnout', timestamp: '2 hours ago' },
    { id: '2', title: 'morning anxiety thoughts', timestamp: 'yesterday' },
    { id: '3', title: 'relationship concerns', timestamp: '3 days ago' },
    { id: '4', title: 'sleep issues discussion', timestamp: '1 week ago' },
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [pinnedChats, setPinnedChats] = useState<Set<string>>(new Set());

  const deleteChat = (id: string) => {
    setChatHistory(prev => prev.filter(chat => chat.id !== id));
  };

  const togglePin = (id: string) => {
    setPinnedChats(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const getConversationStatus = (timestamp: string) => {
    if (timestamp.includes('hour') || timestamp.includes('minute')) return 'today';
    return 'older';
  };

  const truncateMiddle = (text: string, maxLength: number = 30) => {
    if (text.length <= maxLength) return text;
    const halfLength = Math.floor(maxLength / 2);
    return `${text.slice(0, halfLength)}...${text.slice(-halfLength)}`;
  };

  const groupConversations = () => {
    const today: ChatSession[] = [];
    const thisWeek: ChatSession[] = [];
    const earlier: ChatSession[] = [];

    const filtered = chatHistory.filter(chat =>
      chat.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const sorted = [...filtered].sort((a, b) => {
      const aPin = pinnedChats.has(a.id) ? 1 : 0;
      const bPin = pinnedChats.has(b.id) ? 1 : 0;
      return bPin - aPin;
    });

    sorted.forEach(chat => {
      if (chat.timestamp.includes('hour') || chat.timestamp.includes('minute')) {
        today.push(chat);
      } else if (chat.timestamp.includes('yesterday') || chat.timestamp.includes('day')) {
        thisWeek.push(chat);
      } else {
        earlier.push(chat);
      }
    });

    return { today, thisWeek, earlier };
  };

  const navItems = [
    { id: 'chat', label: 'Chat With NIRA', icon: MessageSquare },
    { id: 'journal', label: 'Journal', icon: BookOpen, badge: '1' },
    { id: 'goals', label: 'Goals & Progress', icon: Target },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderChatItem = (chat: ChatSession, index: number) => (
    <div
      key={chat.id}
      className="relative group"
      onMouseEnter={() => setHoveredItem(chat.id)}
      onMouseLeave={() => setHoveredItem(null)}
    >
      {pinnedChats.has(chat.id) && (
        <Pin className="absolute -left-2 top-3 w-3 h-3 text-[#187E5F] dark:text-sage-400 transform rotate-45" />
      )}
      <div
        className="flex items-start gap-3 p-3 rounded-xl hover:bg-[rgba(24,126,95,0.15)] dark:hover:bg-gray-700/50 transition-all duration-200 ease-in-out cursor-pointer hover:shadow-sm hover:border-l-[3px] hover:border-l-[#187E5F] border-l-[3px] border-l-transparent"
        style={{ animationDelay: `${index * 50}ms` }}
        tabIndex={0}
        role="button"
        aria-label={`Open conversation: ${chat.title}`}
      >
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-forest dark:text-gray-200" title={chat.title}>
            {truncateMiddle(chat.title, 30)}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <div className={`rounded-full ${
              getConversationStatus(chat.timestamp) === 'today'
                ? 'w-1 h-1 bg-[#76ac6d]'
                : 'w-[3px] h-[3px] bg-[#a4c1c3]'
            }`}></div>
            <p className="text-xs text-[#9CA3AF] dark:text-gray-500">
              {chat.timestamp}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={(e) => {
              e.stopPropagation();
              togglePin(chat.id);
            }}
            className="p-1.5 hover:bg-sage-100 dark:hover:bg-gray-600 rounded-lg transition-all"
            title={pinnedChats.has(chat.id) ? 'Unpin' : 'Pin to top'}
            aria-label={pinnedChats.has(chat.id) ? 'Unpin conversation' : 'Pin conversation'}
          >
            <Pin className="w-3.5 h-3.5 text-sage-600 dark:text-sage-400" size={14} strokeWidth={2} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              deleteChat(chat.id);
            }}
            className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
            title="Delete chat"
            aria-label="Delete conversation"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-600 dark:text-red-400" size={14} strokeWidth={2} />
          </button>
        </div>
      </div>
      {hoveredItem === chat.id && (
        <div className="absolute left-0 top-full mt-1 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-50 max-w-xs animate-tooltip-appear">
          {chat.title}
        </div>
      )}
    </div>
  );

  return (
    <aside className="w-80 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl flex flex-col transition-colors border-r border-sage-100/50 dark:border-gray-700 overflow-hidden">
      <div className="p-4 border-b border-sage-100/50 dark:border-gray-700">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-forest to-sage-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Brain className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-xl text-forest dark:text-white lowercase">mindshift</h2>
            <p className="text-sm text-sage-600 dark:text-sage-400 lowercase">your companion</p>
          </div>
        </div>

        <h3 className="text-[11px] uppercase tracking-[0.05em] text-sage-500 dark:text-sage-400 font-semibold mb-3 px-2">
          navigation
        </h3>

        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id as any)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-200 ease-in-out relative group focus:outline-none focus:ring-2 focus:ring-[#187E5F] focus:ring-offset-2 ${
                  isActive
                    ? 'bg-[#E8EDE7] dark:bg-gray-700/50 font-semibold shadow-sm border-2 border-[#187E5F]/20 dark:border-sage-600/30'
                    : 'hover:bg-sage-50/80 dark:hover:bg-gray-700/50 hover:shadow-md hover:-translate-y-0.5 border-2 border-transparent'
                }`}
                aria-label={item.label}
                aria-current={isActive ? 'page' : undefined}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#187E5F] dark:bg-sage-400 rounded-r-full transition-all duration-300" />
                )}
                <Icon
                  className={`w-5 h-5 flex-shrink-0 transition-all duration-200 ${
                    isActive ? 'text-[#187E5F] dark:text-sage-400' : 'text-[#66887f] dark:text-gray-400 group-hover:text-[#187E5F]'
                  }`}
                  strokeWidth={2}
                  fill={isActive ? 'currentColor' : 'none'}
                  size={20}
                />
                <span className={`text-sm font-normal transition-colors duration-200 ${
                  isActive ? 'text-[#187E5F] dark:text-sage-400' : 'text-sage-600 dark:text-gray-400'
                }`}>{item.label}</span>
                {item.badge && (
                  <div
                    className="ml-auto w-[18px] h-[18px] bg-[#FF8C42] text-white rounded-full flex items-center justify-center text-[10px] font-bold animate-pulse"
                    aria-label={`${item.badge} new items`}
                  >
                    {item.badge}
                  </div>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-[#E5E7EB] dark:border-gray-700 my-4 mx-6"></div>

      <div className="flex-1 overflow-y-auto custom-scrollbar px-6 pb-6 space-y-4 relative">
        <div className="flex items-center justify-between">
          <h3 className="text-[11px] font-semibold text-[#6B7280] dark:text-gray-400 uppercase tracking-[0.05em]">
            recent conversations
          </h3>
          <div className="relative group">
            <button
              className="p-2 hover:bg-sage-100 dark:hover:bg-gray-700 rounded-xl transition-all duration-200 ease-in-out hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#187E5F] focus:ring-offset-1"
              title="Start new conversation"
              aria-label="Start new conversation"
            >
              <Plus className="w-5 h-5 text-[#187E5F] dark:text-sage-400 transition-colors" size={20} strokeWidth={2} />
            </button>
          </div>
        </div>

        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#66887f] group-focus-within:text-[#187E5F] transition-colors duration-200" size={18} strokeWidth={2} />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-3 bg-[#F8FAF9] dark:bg-gray-700 border border-[#E5E7EB] dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-200 placeholder-[#78968b] focus:outline-none focus:ring-2 focus:ring-[#187E5F] focus:border-transparent transition-all duration-200"
            aria-label="Search conversations"
          />
        </div>

        <div className="space-y-4">
          {(() => {
            const { today, thisWeek, earlier } = groupConversations();
            return (
              <>
                {today.length > 0 && (
                  <div>
                    <h4 className="text-[11px] font-semibold text-[#9CA3AF] dark:text-gray-500 uppercase tracking-[0.05em] mb-2 px-2">
                      Today
                    </h4>
                    <div className="space-y-1">
                      {today.map((chat, index) => renderChatItem(chat, index))}
                    </div>
                  </div>
                )}

                {thisWeek.length > 0 && (
                  <div>
                    <h4 className="text-[11px] font-semibold text-[#9CA3AF] dark:text-gray-500 uppercase tracking-[0.05em] mb-2 px-2">
                      This Week
                    </h4>
                    <div className="space-y-1">
                      {thisWeek.map((chat, index) => renderChatItem(chat, index))}
                    </div>
                  </div>
                )}

                {earlier.length > 0 && (
                  <div>
                    <h4 className="text-[11px] font-semibold text-[#9CA3AF] dark:text-gray-500 uppercase tracking-[0.05em] mb-2 px-2">
                      Earlier
                    </h4>
                    <div className="space-y-1">
                      {earlier.map((chat, index) => renderChatItem(chat, index))}
                    </div>
                  </div>
                )}
              </>
            );
          })()}
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-12 sidebar-fade-gradient pointer-events-none"></div>
      </div>
    </aside>
  );
}
