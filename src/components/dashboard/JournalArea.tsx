import { useState, useEffect } from 'react';
import { Calendar, Mic, Type, Edit3, Trash2, Download, ChevronLeft, ChevronRight, Search, ChevronDown, BookOpen, Lock, HelpCircle, Loader2, Edit, FileText } from 'lucide-react';

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  emoji: string;
  date: Date;
}

type SortOption = 'recent' | 'oldest' | 'most-read';
type TemplateType = 'gratitude' | 'daily' | 'mood' | null;

const templates = {
  gratitude: {
    title: 'Gratitude Journal',
    prompts: [
      'Three things I\'m grateful for today:',
      '1. ',
      '2. ',
      '3. ',
      '\nWhy these matter to me:'
    ].join('\n')
  },
  daily: {
    title: 'Daily Reflection',
    prompts: [
      'Today\'s highlights:',
      '\nChallenges I faced:',
      '\nWhat I learned:',
      '\nTomorrow\'s intentions:'
    ].join('\n')
  },
  mood: {
    title: 'Mood Tracker',
    prompts: [
      'Current mood: ',
      '\nWhat triggered this feeling:',
      '\nPhysical sensations:',
      '\nThoughts I\'m having:',
      '\nWhat might help:'
    ].join('\n')
  }
};

export default function JournalArea() {
  const [entries, setEntries] = useState<JournalEntry[]>([
    {
      id: '1',
      title: 'Grateful for today',
      content: 'Today I managed to complete my work tasks and still had energy for a walk. Feeling proud of my progress. The sunset was beautiful and reminded me to appreciate the small moments. I also had a meaningful conversation with a friend that lifted my spirits.',
      emoji: '🌟',
      date: new Date(),
    },
    {
      id: '2',
      title: 'Reflections on anxiety',
      content: 'Talked with NIRA about my anxiety. The reframing helped me see things differently. I realized that my anxiety often comes from trying to control things outside my power. Learning to let go has been challenging but rewarding.',
      emoji: '💭',
      date: new Date(Date.now() - 86400000),
    },
    {
      id: '3',
      title: 'Morning mindfulness',
      content: 'Started the day with meditation and it made such a difference. Noticed I felt more centered and less reactive throughout the day.',
      emoji: '🧘',
      date: new Date(Date.now() - 172800000),
    },
    {
      id: '4',
      title: 'Progress check-in',
      content: 'Looking back at the past week, I can see real progress in managing my stress levels. The breathing exercises are becoming second nature.',
      emoji: '📈',
      date: new Date(Date.now() - 604800000),
    },
  ]);

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [inputMode, setInputMode] = useState<'text' | 'voice' | 'handwriting'>('text');
  const [newEntry, setNewEntry] = useState({ title: '', content: '', emoji: '📝' });
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showTemplateDropdown, setShowTemplateDropdown] = useState(false);
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const emojiOptions = ['📝', '🌟', '💭', '🌸', '🎯', '💪', '🌈', '🦋', '🌿', '✨'];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSaveEntry();
      }
      if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
        const target = e.target as HTMLElement;
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
          setShowShortcutsModal(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [newEntry]);

  const deleteEntry = (id: string) => {
    setEntries(prev => prev.filter(entry => entry.id !== id));
  };

  const handleSaveEntry = () => {
    if (newEntry.title && newEntry.content) {
      setIsSaving(true);
      setTimeout(() => {
        const entry: JournalEntry = {
          id: Date.now().toString(),
          title: newEntry.title,
          content: newEntry.content,
          emoji: newEntry.emoji,
          date: new Date(),
        };
        setEntries(prev => [entry, ...prev]);
        setNewEntry({ title: '', content: '', emoji: '📝' });
        setLastSaved(new Date());
        setIsSaving(false);
      }, 500);
    }
  };

  const useTemplate = (type: TemplateType) => {
    if (type && templates[type]) {
      setNewEntry({
        title: templates[type].title,
        content: templates[type].prompts,
        emoji: type === 'gratitude' ? '🙏' : type === 'daily' ? '📅' : '😊'
      });
      setShowTemplateDropdown(false);
    }
  };

  const getTimeSince = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes} min ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  const getWordCount = (text: string) => {
    return text.trim().split(/\s+/).length;
  };

  const getReadTime = (text: string) => {
    const words = getWordCount(text);
    const minutes = Math.ceil(words / 200);
    return `${minutes} min read`;
  };

  const getDateGroup = (date: Date) => {
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'TODAY';
    if (diffDays < 7) return 'THIS WEEK';
    if (diffDays < 30) return 'THIS MONTH';
    return 'EARLIER';
  };

  const groupedEntries = () => {
    let filtered = entries.filter(entry =>
      entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

    filtered = [...filtered].sort((a, b) => {
      if (sortBy === 'recent') return b.date.getTime() - a.date.getTime();
      if (sortBy === 'oldest') return a.date.getTime() - b.date.getTime();
      return 0;
    });

    const groups: Record<string, JournalEntry[]> = {};
    filtered.forEach(entry => {
      const group = getDateGroup(entry.date);
      if (!groups[group]) groups[group] = [];
      groups[group].push(entry);
    });

    return groups;
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: startingDayOfWeek }, (_, i) => i);

  const hasEntryOnDate = (day: number) => {
    return entries.some(entry => {
      const entryDate = new Date(entry.date);
      return (
        entryDate.getDate() === day &&
        entryDate.getMonth() === currentMonth.getMonth() &&
        entryDate.getFullYear() === currentMonth.getFullYear()
      );
    });
  };

  const totalEntries = entries.length;
  const thisMonthEntries = entries.filter(e => {
    const now = new Date();
    return e.date.getMonth() === now.getMonth() && e.date.getFullYear() === now.getFullYear();
  }).length;

  const streak = 7;

  const grouped = groupedEntries();
  const hasNoEntries = entries.length === 0;

  return (
    <div className="h-full grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-[1.5rem] shadow-lg border border-sage-100 dark:border-gray-700 p-6 transition-colors">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            New Journal Entry
          </h2>

          <div className="flex gap-2 mb-4 flex-wrap">
            <button
              onClick={() => setInputMode('text')}
              className={`flex items-center gap-2 px-4 py-2 rounded-[1rem] transition-all ${
                inputMode === 'text'
                  ? 'bg-gradient-to-r from-sage-500 to-mint-500 text-white'
                  : 'bg-sage-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              <Type className="w-4 h-4" />
              Text
            </button>
            <button
              onClick={() => setInputMode('voice')}
              className={`flex items-center gap-2 px-4 py-2 rounded-[1rem] transition-all ${
                inputMode === 'voice'
                  ? 'bg-gradient-to-r from-sage-500 to-mint-500 text-white'
                  : 'bg-sage-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              <Mic className="w-4 h-4" />
              Voice
            </button>
            <button
              onClick={() => setInputMode('handwriting')}
              className={`flex items-center gap-2 px-4 py-2 rounded-[1rem] transition-all ${
                inputMode === 'handwriting'
                  ? 'bg-gradient-to-r from-sage-500 to-mint-500 text-white'
                  : 'bg-sage-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              <Edit3 className="w-4 h-4" />
              Handwriting
            </button>

            <div className="relative ml-auto">
              <button
                onClick={() => setShowTemplateDropdown(!showTemplateDropdown)}
                className="flex items-center gap-2 px-4 py-2 rounded-[1rem] bg-sage-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-sage-100 dark:hover:bg-gray-600 transition-all"
              >
                <FileText className="w-4 h-4" />
                Use Template
                <ChevronDown className="w-3 h-3" />
              </button>

              {showTemplateDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-sage-200 dark:border-gray-600 py-2 z-50">
                  <button
                    onClick={() => useTemplate('gratitude')}
                    className="w-full text-left px-4 py-2 hover:bg-sage-50 dark:hover:bg-gray-700 transition-colors text-sm"
                  >
                    <div className="font-medium text-gray-800 dark:text-white">🙏 Gratitude Journal</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">List things you're thankful for</div>
                  </button>
                  <button
                    onClick={() => useTemplate('daily')}
                    className="w-full text-left px-4 py-2 hover:bg-sage-50 dark:hover:bg-gray-700 transition-colors text-sm"
                  >
                    <div className="font-medium text-gray-800 dark:text-white">📅 Daily Reflection</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Reflect on your day</div>
                  </button>
                  <button
                    onClick={() => useTemplate('mood')}
                    className="w-full text-left px-4 py-2 hover:bg-sage-50 dark:hover:bg-gray-700 transition-colors text-sm"
                  >
                    <div className="font-medium text-gray-800 dark:text-white">😊 Mood Tracker</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Track emotions and triggers</div>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {emojiOptions.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => setNewEntry({ ...newEntry, emoji })}
                    className={`text-2xl p-2 rounded-[1rem] transition-all hover:scale-110 ${
                      newEntry.emoji === emoji ? 'bg-blue-100 dark:bg-gray-700' : ''
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <input
              type="text"
              placeholder="Entry title..."
              value={newEntry.title}
              onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
              className="w-full px-4 py-3 rounded-[1rem] border border-sage-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#187E5F] transition-colors"
            />

            {inputMode === 'text' && (
              <textarea
                placeholder="Write your thoughts..."
                value={newEntry.content}
                onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })}
                className="w-full px-4 py-3 rounded-[1rem] border border-sage-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#187E5F] transition-colors resize-none"
                rows={8}
              />
            )}

            {inputMode === 'voice' && (
              <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-sage-200 dark:border-gray-600 rounded-[1rem]">
                <button className="w-20 h-20 bg-gradient-to-r from-sage-600 to-mint-600 rounded-full flex items-center justify-center hover:shadow-lg transition-all">
                  <Mic className="w-10 h-10 text-white" />
                </button>
                <p className="text-gray-600 dark:text-gray-400 mt-4">Click to start recording</p>
              </div>
            )}

            {inputMode === 'handwriting' && (
              <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-sage-200 dark:border-gray-600 rounded-[1rem]">
                <Edit3 className="w-12 h-12 text-sage-600 dark:text-sage-400" />
                <p className="text-gray-600 dark:text-gray-400 mt-4">Handwriting input (tablet/mobile)</p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">Draw or write here</p>
              </div>
            )}

            <div className="flex gap-3 items-center">
              <button
                onClick={handleSaveEntry}
                disabled={!newEntry.title || !newEntry.content || isSaving}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-[#187E5F] to-[#0B5844] text-white rounded-[1rem] hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    Save Entry
                    <span className="text-xs opacity-75">(Ctrl+S)</span>
                  </>
                )}
              </button>
              <button
                className="group relative flex items-center gap-2 px-6 py-3 bg-sage-50 dark:bg-gray-700 text-sage-600 dark:text-sage-400 rounded-[1rem] hover:bg-sage-100 dark:hover:bg-gray-600 transition-colors"
                title="Import insights from conversations"
              >
                <Download className="w-4 h-4" />
                Import from Chat
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-800 dark:bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                  Import insights from conversations
                </div>
              </button>
            </div>

            {lastSaved && (
              <div className="text-center">
                <p className="text-[11px] text-[#a4c1c3]">
                  Last saved: {getTimeSince(lastSaved)}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-[1.5rem] shadow-lg border border-sage-100 dark:border-gray-700 p-6 transition-colors">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Stats</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-sage-50 dark:bg-gray-700 rounded-xl p-4 text-center">
              <div className="text-[18px] font-bold text-[#187E5F] dark:text-sage-400">{totalEntries}</div>
              <div className="text-[12px] text-[#78968b] dark:text-gray-400">Total Entries</div>
            </div>
            <div className="bg-sage-50 dark:bg-gray-700 rounded-xl p-4 text-center">
              <div className="text-[18px] font-bold text-[#187E5F] dark:text-sage-400">{streak} 🔥</div>
              <div className="text-[12px] text-[#78968b] dark:text-gray-400">Day Streak</div>
            </div>
            <div className="bg-sage-50 dark:bg-gray-700 rounded-xl p-4 text-center">
              <div className="text-[18px] font-bold text-[#187E5F] dark:text-sage-400">{thisMonthEntries}</div>
              <div className="text-[12px] text-[#78968b] dark:text-gray-400">This Month</div>
            </div>
            <div className="bg-sage-50 dark:bg-gray-700 rounded-xl p-4 text-center">
              <div className="text-[18px] font-bold text-[#187E5F] dark:text-sage-400">{entries.length > 0 ? getWordCount(entries[0].content) : 0}</div>
              <div className="text-[12px] text-[#78968b] dark:text-gray-400">Avg Words</div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-[1.5rem] shadow-lg border border-sage-100 dark:border-gray-700 p-6 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Calendar View</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                className="p-2 hover:bg-sage-50 dark:hover:bg-gray-700 rounded-[1rem] transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[120px] text-center">
                {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </span>
              <button
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                className="p-2 hover:bg-sage-50 dark:hover:bg-gray-700 rounded-[1rem] transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center text-xs font-semibold text-gray-600 dark:text-gray-400 py-2">
                {day}
              </div>
            ))}
            {blanks.map((blank) => (
              <div key={`blank-${blank}`} />
            ))}
            {days.map((day) => (
              <div
                key={day}
                className={`aspect-square flex items-center justify-center text-sm rounded-[1rem] transition-all ${
                  hasEntryOnDate(day)
                    ? 'bg-gradient-to-br from-[#187E5F] to-[#0B5844] text-white font-semibold cursor-pointer hover:shadow-md'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-sage-50 dark:hover:bg-gray-700 cursor-pointer'
                }`}
              >
                {day}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-[1.5rem] shadow-lg border border-sage-100 dark:border-gray-700 p-6 transition-colors flex flex-col">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-sage-600 dark:text-sage-400" />
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Journal Entries</h2>
        </div>

        <div className="space-y-3 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search your journal..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-sage-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#187E5F] transition-colors text-sm"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="relative">
              <button
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl border border-sage-200 dark:border-gray-600 hover:bg-sage-50 dark:hover:bg-gray-700 transition-colors text-sm"
              >
                <span className="text-gray-700 dark:text-gray-300">
                  {sortBy === 'recent' ? 'Most Recent' : sortBy === 'oldest' ? 'Oldest' : 'Most Read'}
                </span>
                <ChevronDown className="w-3 h-3 text-gray-500" />
              </button>

              {showSortDropdown && (
                <div className="absolute top-full left-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-sage-200 dark:border-gray-600 py-2 z-50">
                  <button
                    onClick={() => { setSortBy('recent'); setShowSortDropdown(false); }}
                    className="w-full text-left px-4 py-2 hover:bg-sage-50 dark:hover:bg-gray-700 transition-colors text-sm text-gray-700 dark:text-gray-300"
                  >
                    Most Recent
                  </button>
                  <button
                    onClick={() => { setSortBy('oldest'); setShowSortDropdown(false); }}
                    className="w-full text-left px-4 py-2 hover:bg-sage-50 dark:hover:bg-gray-700 transition-colors text-sm text-gray-700 dark:text-gray-300"
                  >
                    Oldest
                  </button>
                  <button
                    onClick={() => { setSortBy('most-read'); setShowSortDropdown(false); }}
                    className="w-full text-left px-4 py-2 hover:bg-sage-50 dark:hover:bg-gray-700 transition-colors text-sm text-gray-700 dark:text-gray-300"
                  >
                    Most Read
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => setShowShortcutsModal(true)}
              className="p-2 hover:bg-sage-50 dark:hover:bg-gray-700 rounded-xl transition-colors"
              title="Keyboard shortcuts"
            >
              <HelpCircle className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-6 pr-2">
          {hasNoEntries ? (
            <div className="flex flex-col items-center justify-center py-20">
              <BookOpen className="w-16 h-16 text-[#a4c1c3] mb-4" />
              <p className="text-lg font-medium text-gray-600 dark:text-gray-400">Your journal is waiting</p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">Start writing your first entry above</p>
            </div>
          ) : (
            <>
              {Object.entries(grouped).map(([group, groupEntries]) => (
                <div key={group}>
                  <h3 className="text-[11px] font-semibold text-[#a4c1c3] uppercase tracking-wider mb-3 px-1">
                    {group}
                  </h3>
                  <div className="space-y-3">
                    {groupEntries.map((entry) => (
                      <div
                        key={entry.id}
                        className="group relative bg-white dark:bg-[#315545] p-4 rounded-xl border border-sage-100 dark:border-gray-700 hover:border-[#187E5F] dark:hover:border-[#187E5F] transition-all cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(24,126,95,0.15)]"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-3 flex-1">
                            <span className="text-2xl">{entry.emoji}</span>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-gray-800 dark:text-white truncate">{entry.title}</h3>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {entry.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              className="p-1.5 hover:bg-sage-50 dark:hover:bg-gray-700 rounded-lg transition-all"
                              title="Edit entry"
                            >
                              <Edit className="w-4 h-4 text-[#66887f] hover:text-[#187E5F] transition-colors" />
                            </button>
                            <button
                              onClick={() => deleteEntry(entry.id)}
                              className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                              title="Delete entry"
                            >
                              <Trash2 className="w-4 h-4 text-[#66887f] hover:text-[#187E5F] transition-colors" />
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed line-clamp-2 mb-2">
                          {entry.content}
                        </p>
                        <div className="flex items-center gap-3 text-[12px] text-[#78968b] dark:text-gray-400">
                          <span>{entry.emoji} {getReadTime(entry.content)}</span>
                          <span>•</span>
                          <span>{getWordCount(entry.content)} words</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-sage-100 dark:border-gray-700 text-center">
          <p className="text-[11px] text-[#78968b] dark:text-gray-400 flex items-center justify-center gap-1">
            <Lock className="w-3 h-3" />
            Your journal is private
          </p>
        </div>
      </div>

      {showShortcutsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowShortcutsModal(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Keyboard Shortcuts</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Save entry</span>
                <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono">Ctrl+S</kbd>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Show shortcuts</span>
                <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono">?</kbd>
              </div>
            </div>
            <button
              onClick={() => setShowShortcutsModal(false)}
              className="mt-6 w-full px-4 py-2 bg-gradient-to-r from-[#187E5F] to-[#0B5844] text-white rounded-xl hover:shadow-lg transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
