import { MessageSquare, BookOpen, Settings, Target, Trash2, Plus, Brain, Search, Pin, Archive, MoreVertical } from 'lucide-react';
import { useState } from 'react';
import DailyQuote from './DailyQuote';

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

  const truncateMiddle = (text: string, maxLength: number = 25) => {
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
    { id: 'chat', label: 'Chat With NIRA', icon: MessageSquare, color: 'text-sage-600 dark:text-sage-400', hoverBg: 'hover:bg-sage-50/80 dark:hover:bg-gray-700/50', activeBg: 'bg-[#E8EDE7] dark:bg-gray-700/50', activeBar: 'bg-[#8B9D83] dark:bg-sage-400', badge: null },
    { id: 'journal', label: 'Journal', icon: BookOpen, color: 'text-sage-600 dark:text-sage-400', hoverBg: 'hover:bg-sage-50/80 dark:hover:bg-gray-700/50', activeBg: 'bg-[#E8EDE7] dark:bg-gray-700/50', activeBar: 'bg-[#8B9D83] dark:bg-sage-400', badge: '1' },
    { id: 'goals', label: 'Goals & Progress', icon: Target, color: 'text-sage-600 dark:text-sage-400', hoverBg: 'hover:bg-sage-50/80 dark:hover:bg-gray-700/50', activeBg: 'bg-[#E8EDE7] dark:bg-gray-700/50', activeBar: 'bg-[#8B9D83] dark:bg-sage-400', badge: null },
    { id: 'settings', label: 'Settings', icon: Settings, color: 'text-sage-600 dark:text-sage-400', hoverBg: 'hover:bg-sage-50/80 dark:hover:bg-gray-700/50', activeBg: 'bg-[#E8EDE7] dark:bg-gray-700/50', activeBar: 'bg-[#8B9D83] dark:bg-sage-400', badge: null },
  ];

  return (
    <aside className="w-80 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl flex flex-col transition-colors border-r border-sage-100/50 dark:border-gray-700 overflow-hidden">
      <div className="p-8 border-b border-sage-100/50 dark:border-gray-700">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-forest to-sage-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Brain className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-xl text-forest dark:text-white lowercase">mindshift</h2>
            <p className="text-sm text-sage-600 dark:text-sage-400 lowercase">your companion</p>
          </div>
        </div>

        <h3 className="text-xs uppercase tracking-wider text-sage-500 dark:text-sage-400 font-semibold mb-4 px-4 lowercase">
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
                className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-200 ease-in-out relative group focus:outline-none focus:ring-2 focus:ring-sage-500 focus:ring-offset-2 ${
                  isActive
                    ? `${item.activeBg} font-semibold shadow-sm border-2 border-[#8B9D83]/20 dark:border-sage-600/30`
                    : `${item.hoverBg} hover:shadow-md hover:-translate-y-0.5 border-2 border-transparent`
                }`}
                aria-label={item.label}
                aria-current={isActive ? 'page' : undefined}
              >
                {isActive && (
                  <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 ${item.activeBar} rounded-r-full transition-all duration-300`} />
                )}
                <Icon
                  className={`w-5 h-5 flex-shrink-0 transition-colors duration-200 ${
                    isActive ? item.color : 'text-sage-500 dark:text-gray-400 group-hover:' + item.color.split(' ')[0]
                  }`}
                  strokeWidth={isActive ? 2.5 : 2}
                  fill={isActive ? 'currentColor' : 'none'}
                />
                <span className={`text-base transition-colors duration-200 ${
                  isActive ? item.color : 'text-sage-600 dark:text-gray-400'
                }`}>{item.label}</span>
                {item.badge && (
                  <div
                    className="ml-auto w-5 h-5 bg-[#8B9D83] text-white rounded-full flex items-center justify-center text-xs font-bold animate-pulse"
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

      <div className="border-t border-[#E5E7EB] dark:border-gray-700 my-4 mx-8"></div>

      <div className="px-8 mb-6">
        <DailyQuote />
      </div>

      <div className="border-t border-[#E5E7EB] dark:border-gray-700 my-4 mx-8"></div>

      <div className="flex-1 overflow-y-auto px-8 pb-8 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-[#6B7280] dark:text-gray-400 uppercase tracking-wide">
            recent conversations
          </h3>
          <div className="relative group">
            <button
              className="p-2 hover:bg-sage-100 dark:hover:bg-gray-700 rounded-xl transition-all duration-200 ease-in-out hover:scale-110 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:ring-offset-1"
              title="Start new conversation"
              aria-label="Start new conversation"
            >
              <Plus className="w-6 h-6 text-sage-600 dark:text-sage-400 group-hover:text-[#8B9D83] transition-colors animate-gentle-pulse" />
            </button>
            <span className="absolute right-0 top-full mt-1 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-150 whitespace-nowrap pointer-events-none">
              Start new conversation
            </span>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-3 bg-white dark:bg-gray-700 border border-[#E5E7EB] dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8B9D83] focus:border-transparent transition-all duration-200"
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
                    <h4 className="text-[11px] font-semibold text-[#9CA3AF] dark:text-gray-500 uppercase tracking-wider mb-2 px-2">
                      Today
                    </h4>
                    <div className="space-y-1">
                      {today.map((chat, index) => (
                        <div
                          key={chat.id}
                          className="relative group"
                          onMouseEnter={() => setHoveredItem(chat.id)}
                          onMouseLeave={() => setHoveredItem(null)}
                        >
                          {pinnedChats.has(chat.id) && (
                            <Pin className="absolute -left-2 top-3 w-3 h-3 text-sage-600 dark:text-sage-400 transform rotate-45" />
                          )}
                          <div
                            className="flex items-start gap-3 p-3 rounded-xl hover:bg-[#F9FAFB] dark:hover:bg-gray-700/50 transition-all duration-200 ease-in-out cursor-pointer hover:shadow-sm"
                            style={{ animationDelay: `${index * 50}ms` }}
                            tabIndex={0}
                            role="button"
                            aria-label={`Open conversation: ${chat.title}`}
                          >
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-forest dark:text-gray-200 lowercase" title={chat.title}>
                                {truncateMiddle(chat.title, 28)}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <div className={`w-1.5 h-1.5 rounded-full ${
                                  getConversationStatus(chat.timestamp) === 'today'
                                    ? 'bg-green-500'
                                    : 'bg-gray-400'
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
                                <Pin className="w-3.5 h-3.5 text-sage-600 dark:text-sage-400" />
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
                                <Trash2 className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                              </button>
                            </div>
                          </div>
                          {hoveredItem === chat.id && (
                            <div className="absolute left-0 top-full mt-1 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-50 max-w-xs animate-tooltip-appear">
                              {chat.title}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {thisWeek.length > 0 && (
                  <div>
                    <h4 className="text-[11px] font-semibold text-[#9CA3AF] dark:text-gray-500 uppercase tracking-wider mb-2 px-2">
                      This Week
                    </h4>
                    <div className="space-y-1">
                      {thisWeek.map((chat, index) => (
                        <div
                          key={chat.id}
                          className="relative group"
                          onMouseEnter={() => setHoveredItem(chat.id)}
                          onMouseLeave={() => setHoveredItem(null)}
                        >
                          {pinnedChats.has(chat.id) && (
                            <Pin className="absolute -left-2 top-3 w-3 h-3 text-sage-600 dark:text-sage-400 transform rotate-45" />
                          )}
                          <div
                            className="flex items-start gap-3 p-3 rounded-xl hover:bg-[#F9FAFB] dark:hover:bg-gray-700/50 transition-all duration-200 ease-in-out cursor-pointer hover:shadow-sm"
                            style={{ animationDelay: `${index * 50}ms` }}
                            tabIndex={0}
                            role="button"
                            aria-label={`Open conversation: ${chat.title}`}
                          >
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-forest dark:text-gray-200 lowercase" title={chat.title}>
                                {truncateMiddle(chat.title, 28)}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <div className={`w-1.5 h-1.5 rounded-full ${
                                  getConversationStatus(chat.timestamp) === 'today'
                                    ? 'bg-green-500'
                                    : 'bg-gray-400'
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
                                <Pin className="w-3.5 h-3.5 text-sage-600 dark:text-sage-400" />
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
                                <Trash2 className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                              </button>
                            </div>
                          </div>
                          {hoveredItem === chat.id && (
                            <div className="absolute left-0 top-full mt-1 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-50 max-w-xs animate-tooltip-appear">
                              {chat.title}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {earlier.length > 0 && (
                  <div>
                    <h4 className="text-[11px] font-semibold text-[#9CA3AF] dark:text-gray-500 uppercase tracking-wider mb-2 px-2">
                      Earlier
                    </h4>
                    <div className="space-y-1">
                      {earlier.map((chat, index) => (
                        <div
                          key={chat.id}
                          className="relative group"
                          onMouseEnter={() => setHoveredItem(chat.id)}
                          onMouseLeave={() => setHoveredItem(null)}
                        >
                          {pinnedChats.has(chat.id) && (
                            <Pin className="absolute -left-2 top-3 w-3 h-3 text-sage-600 dark:text-sage-400 transform rotate-45" />
                          )}
                          <div
                            className="flex items-start gap-3 p-3 rounded-xl hover:bg-[#F9FAFB] dark:hover:bg-gray-700/50 transition-all duration-200 ease-in-out cursor-pointer hover:shadow-sm"
                            style={{ animationDelay: `${index * 50}ms` }}
                            tabIndex={0}
                            role="button"
                            aria-label={`Open conversation: ${chat.title}`}
                          >
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-forest dark:text-gray-200 lowercase" title={chat.title}>
                                {truncateMiddle(chat.title, 28)}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <div className={`w-1.5 h-1.5 rounded-full ${
                                  getConversationStatus(chat.timestamp) === 'today'
                                    ? 'bg-green-500'
                                    : 'bg-gray-400'
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
                                <Pin className="w-3.5 h-3.5 text-sage-600 dark:text-sage-400" />
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
                                <Trash2 className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                              </button>
                            </div>
                          </div>
                          {hoveredItem === chat.id && (
                            <div className="absolute left-0 top-full mt-1 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-50 max-w-xs animate-tooltip-appear">
                              {chat.title}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            );
          })()}
        </div>
      </div>
    </aside>
  );
}
