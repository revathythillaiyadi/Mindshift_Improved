import { AlertCircle, TrendingUp, Flame, Target, Bell, Check } from 'lucide-react';
import { useState, useEffect } from 'react';

interface RightPanelProps {
  selectedRegion: string;
}

const regionalContacts: Record<string, { crisis: string; hotline: string; emergency: string }> = {
  US: {
    crisis: '988 (Suicide & Crisis Lifeline)',
    hotline: '1-800-273-8255 (National Suicide Prevention)',
    emergency: '911',
  },
  UK: {
    crisis: '116 123 (Samaritans)',
    hotline: '0800 689 5652 (Campaign Against Living Miserably)',
    emergency: '999',
  },
  CA: {
    crisis: '1-833-456-4566 (Talk Suicide Canada)',
    hotline: '1-866-277-3553 (Kids Help Phone)',
    emergency: '911',
  },
  AU: {
    crisis: '13 11 14 (Lifeline)',
    hotline: '1800 55 1800 (Kids Helpline)',
    emergency: '000',
  },
  IN: {
    crisis: '9152987821 (AASRA)',
    hotline: '080 46110007 (iCall)',
    emergency: '112',
  },
  DE: {
    crisis: '0800 1110111 (TelefonSeelsorge)',
    hotline: '0800 1110222 (TelefonSeelsorge)',
    emergency: '112',
  },
  FR: {
    crisis: '3114 (National Suicide Prevention)',
    hotline: '01 45 39 40 00 (SOS Amitié)',
    emergency: '112',
  },
  JP: {
    crisis: '0120-783-556 (TELL Lifeline)',
    hotline: '0570-064-556 (Mental Health Support)',
    emergency: '110',
  },
};

export default function RightPanel({ selectedRegion }: RightPanelProps) {
  const [showSOSModal, setShowSOSModal] = useState(false);
  const [streakCelebration, setStreakCelebration] = useState(false);
  const [completedGoals, setCompletedGoals] = useState<Set<string>>(new Set());

  const contacts = regionalContacts[selectedRegion] || regionalContacts.US;

  const triggerStreakCelebration = () => {
    setStreakCelebration(true);
    setTimeout(() => setStreakCelebration(false), 1500);
  };

  const toggleGoalCompletion = (goalName: string) => {
    setCompletedGoals(prev => {
      const newSet = new Set(prev);
      if (newSet.has(goalName)) {
        newSet.delete(goalName);
      } else {
        newSet.add(goalName);
      }
      return newSet;
    });
  };

  const moodData = [
    { date: 'Mon', mood: 7 },
    { date: 'Tue', mood: 6 },
    { date: 'Wed', mood: 8 },
    { date: 'Thu', mood: 7 },
    { date: 'Fri', mood: 9 },
    { date: 'Sat', mood: 8 },
    { date: 'Sun', mood: 8 },
  ];

  const maxMood = 10;

  return (
    <>
      <aside className="w-96 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-l border-sage-100/50 dark:border-gray-700 overflow-y-auto transition-colors">
        <div className="p-8 space-y-8">
          <button
            onClick={() => setShowSOSModal(true)}
            className="w-full py-4 bg-gradient-to-r from-[#FF6B6B] to-[#FA8072] text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] flex items-center justify-center gap-2 animate-sos-pulse"
          >
            <AlertCircle className="w-6 h-6" />
            SOS - Get Help Now
          </button>

          <div
            className={`bg-gradient-to-br from-[#E8F5E9] via-[#F1F8E9] to-[#E0F2F1] dark:from-gray-700/80 dark:via-gray-600/80 dark:to-gray-700/80 rounded-2xl p-5 transition-all cursor-pointer shadow-sm hover:shadow-md ${streakCelebration ? 'animate-streak-glow animate-streak-pop' : ''}`}
            onClick={triggerStreakCelebration}
          >
            <div className="flex items-center gap-2 mb-3">
              <Flame className="w-5 h-5 text-[#FF9F9B]" />
              <h3 className="font-semibold text-gray-800 dark:text-white lowercase">current streak</h3>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold bg-gradient-to-r from-[#FF9F9B] to-[#FFD4C4] bg-clip-text text-transparent">
                7
              </span>
              <span className="text-gray-600 dark:text-gray-300 lowercase">days</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 lowercase">
              keep it up! you're building healthy habits.
            </p>
          </div>

          <div className="bg-gradient-to-br from-white via-[#FFF9F5] to-white dark:from-gray-700 dark:via-gray-700/80 dark:to-gray-700 rounded-2xl p-5 border border-[#FFE8DC]/40 dark:border-gray-600 transition-colors shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-[#FF9F9B]" />
              <h3 className="font-semibold text-gray-800 dark:text-white lowercase">mood tracker</h3>
            </div>
            <div className="space-y-2">
              <div className="flex items-end justify-between h-32 gap-1">
                {moodData.map((day) => (
                  <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full bg-gradient-to-t from-[#FF9F9B] to-[#FFD4C4] rounded-t-lg transition-all hover:opacity-80 hover:scale-105"
                      style={{ height: `${(day.mood / maxMood) * 100}%` }}
                    />
                    <span className="text-xs text-gray-600 dark:text-gray-400">{day.date}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>last 7 days</span>
                <span className="text-[#FF9F9B] dark:text-[#FFD4C4] font-medium">trending up</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white via-[#F5F9FF] to-white dark:from-gray-700 dark:via-gray-700/80 dark:to-gray-700 rounded-2xl p-5 border border-[#E6E6FA]/40 dark:border-gray-600 transition-colors shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-[#E6E6FA]" />
              <h3 className="font-semibold text-gray-800 dark:text-white lowercase">goals progress</h3>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleGoalCompletion('daily-checkin')}
                      className="relative w-5 h-5 rounded-full border-2 border-[#FF9F9B] dark:border-[#FFD4C4] transition-all hover:scale-110"
                    >
                      {completedGoals.has('daily-checkin') && (
                        <div className="absolute inset-0">
                          <svg className="w-full h-full" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10" fill="currentColor" className="text-[#FF9F9B] dark:text-[#FFD4C4] animate-checkmark-circle" />
                            <path d="M7 13l3 3 7-7" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="animate-checkmark-draw" strokeDasharray="100" />
                          </svg>
                        </div>
                      )}
                    </button>
                    <span className="text-sm text-gray-700 dark:text-gray-300 lowercase">daily check-in</span>
                  </div>
                  <span className="text-sm font-medium text-[#FF9F9B] dark:text-[#FFD4C4]">7/7</span>
                </div>
                <div className="h-2 bg-[#FFE8DC]/30 dark:bg-gray-600 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#FF9F9B] to-[#FFD4C4] rounded-full transition-all duration-500" style={{ width: '100%' }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleGoalCompletion('journal-entries')}
                      className="relative w-5 h-5 rounded-full border-2 border-[#FF9F9B] dark:border-[#FFD4C4] transition-all hover:scale-110"
                    >
                      {completedGoals.has('journal-entries') && (
                        <div className="absolute inset-0">
                          <svg className="w-full h-full" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10" fill="currentColor" className="text-[#FF9F9B] dark:text-[#FFD4C4] animate-checkmark-circle" />
                            <path d="M7 13l3 3 7-7" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="animate-checkmark-draw" strokeDasharray="100" />
                          </svg>
                        </div>
                      )}
                    </button>
                    <span className="text-sm text-gray-700 dark:text-gray-300 lowercase">journal entries</span>
                  </div>
                  <span className="text-sm font-medium text-[#FF9F9B] dark:text-[#FFD4C4]">4/10</span>
                </div>
                <div className="h-2 bg-[#FFE8DC]/30 dark:bg-gray-600 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#FF9F9B] to-[#FFD4C4] rounded-full transition-all duration-500" style={{ width: '40%' }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleGoalCompletion('mindfulness')}
                      className="relative w-5 h-5 rounded-full border-2 border-[#FF9F9B] dark:border-[#FFD4C4] transition-all hover:scale-110"
                    >
                      {completedGoals.has('mindfulness') && (
                        <div className="absolute inset-0">
                          <svg className="w-full h-full" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10" fill="currentColor" className="text-[#FF9F9B] dark:text-[#FFD4C4] animate-checkmark-circle" />
                            <path d="M7 13l3 3 7-7" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="animate-checkmark-draw" strokeDasharray="100" />
                          </svg>
                        </div>
                      )}
                    </button>
                    <span className="text-sm text-gray-700 dark:text-gray-300 lowercase">mindfulness minutes</span>
                  </div>
                  <span className="text-sm font-medium text-[#FF9F9B] dark:text-[#FFD4C4]">45/60</span>
                </div>
                <div className="h-2 bg-[#FFE8DC]/30 dark:bg-gray-600 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#FF9F9B] to-[#FFD4C4] rounded-full transition-all duration-500" style={{ width: '75%' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#FFF9F0] via-[#FFF5E8] to-[#FFFBF5] dark:from-amber-900/20 dark:via-amber-800/20 dark:to-amber-900/20 rounded-2xl p-5 border border-[#FFE8D6]/50 dark:border-amber-800 transition-colors shadow-sm">
            <div className="flex items-start gap-3">
              <Bell className="w-5 h-5 text-[#FFD4C4] dark:text-[#FFD4C4] flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-white mb-1">Daily Check-in</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  How are you feeling today? Take a moment to chat with NIRA.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white via-[#FFF0F5] to-white dark:from-gray-700 dark:via-gray-700/80 dark:to-gray-700 rounded-2xl p-5 border border-[#FFE8F0]/40 dark:border-gray-600 transition-colors shadow-sm">
            <h3 className="font-semibold text-gray-800 dark:text-white mb-3">Recent Achievements</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-[#FFF9F5] to-[#FFF5F0] dark:bg-gray-600 rounded-xl hover:shadow-sm transition-all">
                <span className="text-2xl">🎯</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800 dark:text-white">7-Day Streak!</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Checked in daily</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-[#FFF9F5] to-[#FFF5F0] dark:bg-gray-600 rounded-xl hover:shadow-sm transition-all">
                <span className="text-2xl">📝</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800 dark:text-white">Journaling Pro</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">10 entries written</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-[#FFF9F5] to-[#FFF5F0] dark:bg-gray-600 rounded-xl hover:shadow-sm transition-all">
                <span className="text-2xl">🌟</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800 dark:text-white">Mood Improver</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Positive trend this week</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {showSOSModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-[1.5rem] shadow-2xl max-w-md w-full p-6 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <h2 className="text-2xl font-bold lowercase text-gray-800 dark:text-white">emergency resources</h2>
            </div>

            <p className="text-gray-600 dark:text-gray-300 mb-6">
              If you're in crisis or need immediate support, please reach out to one of these services:
            </p>

            <div className="space-y-4 mb-6">
              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-[1rem] border border-red-200 dark:border-red-800">
                <h3 className="font-semibold text-red-900 dark:text-red-200 mb-2">Crisis Hotline</h3>
                <a
                  href={`tel:${contacts.crisis.split(' ')[0]}`}
                  className="text-lg font-bold text-red-600 dark:text-red-400 hover:underline"
                >
                  {contacts.crisis}
                </a>
              </div>

              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-[1rem] border border-amber-200 dark:border-amber-800">
                <h3 className="font-semibold text-amber-900 dark:text-amber-200 mb-2">Support Hotline</h3>
                <a
                  href={`tel:${contacts.hotline.split(' ')[0]}`}
                  className="text-lg font-bold text-amber-600 dark:text-amber-400 hover:underline"
                >
                  {contacts.hotline}
                </a>
              </div>

              <div className="p-4 bg-sage-50 dark:bg-sage-900/20 rounded-[1rem] border border-blue-200 dark:border-blue-800">
                <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">Emergency Services</h3>
                <a
                  href={`tel:${contacts.emergency}`}
                  className="text-lg font-bold text-sage-600 dark:text-sage-400 hover:underline"
                >
                  {contacts.emergency}
                </a>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowSOSModal(false)}
                className="flex-1 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-[1rem] hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
              >
                Close
              </button>
              <button className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-[1rem] hover:shadow-lg transition-all font-medium">
                Call Now
              </button>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
              You're not alone. Help is available 24/7.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
