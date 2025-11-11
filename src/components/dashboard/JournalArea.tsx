import { useState } from 'react';
import { Calendar, Mic, Type, Edit3, Trash2, MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react';

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  emoji: string;
  date: Date;
}

export default function JournalArea() {
  const [entries, setEntries] = useState<JournalEntry[]>([
    {
      id: '1',
      title: 'Grateful for today',
      content: 'Today I managed to complete my work tasks and still had energy for a walk. Feeling proud of my progress.',
      emoji: '🌟',
      date: new Date('2025-11-04'),
    },
    {
      id: '2',
      title: 'Reflections on anxiety',
      content: 'Talked with NIRA about my anxiety. The reframing helped me see things differently.',
      emoji: '💭',
      date: new Date('2025-11-03'),
    },
  ]);

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [inputMode, setInputMode] = useState<'text' | 'voice' | 'handwriting'>('text');
  const [newEntry, setNewEntry] = useState({ title: '', content: '', emoji: '📝' });

  const emojiOptions = ['📝', '🌟', '💭', '🌸', '🎯', '💪', '🌈', '🦋', '🌿', '✨'];

  const deleteEntry = (id: string) => {
    setEntries(prev => prev.filter(entry => entry.id !== id));
  };

  const handleSaveEntry = () => {
    if (newEntry.title && newEntry.content) {
      const entry: JournalEntry = {
        id: Date.now().toString(),
        title: newEntry.title,
        content: newEntry.content,
        emoji: newEntry.emoji,
        date: new Date(),
      };
      setEntries(prev => [entry, ...prev]);
      setNewEntry({ title: '', content: '', emoji: '📝' });
    }
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

  return (
    <div className="h-full grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-[1.5rem] shadow-lg border border-sage-100 dark:border-gray-700 p-6 transition-colors">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            New Journal Entry
          </h2>

          <div className="flex gap-2 mb-4">
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
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex gap-2 overflow-x-auto pb-2">
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
              className="w-full px-4 py-3 rounded-[1rem] border border-sage-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            />

            {inputMode === 'text' && (
              <textarea
                placeholder="Write your thoughts..."
                value={newEntry.content}
                onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })}
                className="w-full px-4 py-3 rounded-[1rem] border border-sage-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-none"
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

            <div className="flex gap-3">
              <button
                onClick={handleSaveEntry}
                disabled={!newEntry.title || !newEntry.content}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-sage-600 to-mint-600 text-white rounded-[1rem] hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                Save Entry
              </button>
              <button className="flex items-center gap-2 px-6 py-3 bg-sage-50 dark:bg-gray-700 text-sage-600 dark:text-sage-400 rounded-[1rem] hover:bg-blue-100 dark:hover:bg-gray-600 transition-colors">
                <MessageSquare className="w-4 h-4" />
                Import from NIRA
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-[1.5rem] shadow-lg border border-sage-100 dark:border-gray-700 p-6 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Calendar View</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                className="p-2 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-[1rem] transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[120px] text-center">
                {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </span>
              <button
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                className="p-2 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-[1rem] transition-colors"
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
                className={`aspect-square flex items-center justify-center text-sm rounded-[1rem] transition-colors ${
                  hasEntryOnDate(day)
                    ? 'bg-gradient-to-br from-sage-500 to-mint-500 text-white font-semibold cursor-pointer hover:shadow-md'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer'
                }`}
              >
                {day}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-[1.5rem] shadow-lg border border-sage-100 dark:border-gray-700 p-6 transition-colors overflow-y-auto">
        <div className="flex items-center gap-2 mb-6">
          <Calendar className="w-5 h-5 text-sage-600 dark:text-sage-400" />
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Journal Entries</h2>
        </div>

        <div className="space-y-4">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="group p-4 rounded-[1rem] border border-sage-100 dark:border-gray-700 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{entry.emoji}</span>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-white">{entry.title}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {entry.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => deleteEntry(entry.id)}
                  className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-[1rem] transition-all"
                  title="Delete entry"
                >
                  <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                </button>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{entry.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
