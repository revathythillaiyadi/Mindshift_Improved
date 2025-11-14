import { AlertCircle, TrendingUp, Flame, Target, Bell, ChevronDown, ChevronUp, Award, Activity } from 'lucide-react';
import { useState, useEffect } from 'react';
import MilestonesAchievements from './MilestonesAchievements';
import DailyQuote from './DailyQuote';

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
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['streak', 'goals']));

  const getStreakMessage = (days: number) => {
    if (days >= 30) return "You're unstoppable! A full month of dedication!";
    if (days >= 14) return "Two weeks strong! You're building incredible habits!";
    if (days >= 7) return "One week streak! You're doing amazing!";
    if (days >= 3) return "Great start! Keep the momentum going!";
    return "Every journey begins with a single step!";
  };

  const streakDays = 7;

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

  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
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

  const weeklyStats = {
    totalCheckIns: 12,
    journalEntries: 8,
    mindfulnessMinutes: 45,
    moodImprovement: 15,
    entriesIncrease: 3,
  };

  const maxMood = 10;

  return (
    <>
      <aside className="w-96 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-l border-sage-100/50 dark:border-gray-700 overflow-y-auto custom-scrollbar transition-colors">
        <div className="p-6 pr-4 space-y-5">
          <button
            onClick={() => setShowSOSModal(true)}
            className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-semibold text-base shadow-[0_4px_12px_rgba(255,140,66,0.35)] hover:shadow-xl transition-all hover:scale-[1.02] hover:-translate-y-[1px] animate-gentle-pulse flex items-center justify-center gap-2"
            style={{ backgroundColor: '#FF8C42', backgroundImage: 'linear-gradient(135deg, #FF8C42 0%, #FFB347 100%)' }}
          >
            <AlertCircle className="w-5 h-5" />
            Get Help Now
          </button>

          <div className="bg-white dark:bg-gray-700 rounded-xl border border-sage-100 dark:border-gray-600 overflow-hidden transition-all shadow-sm hover:shadow-md">
            <button
              onClick={() => toggleSection('streak')}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-sage-50/50 dark:hover:bg-gray-600/50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-500" />
                <h3 className="text-base font-semibold text-gray-800 dark:text-white">Current Streak</h3>
              </div>
              {expandedSections.has('streak') ? (
                <ChevronUp className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              )}
            </button>
            {expandedSections.has('streak') && (
              <div
                className={`px-4 pb-4 bg-gradient-to-br from-orange-50/50 to-amber-50/50 dark:from-gray-600/30 dark:to-gray-600/30 cursor-pointer transition-all relative overflow-hidden ${streakCelebration ? 'animate-streak-glow animate-celebration-bounce' : ''}`}
                onClick={triggerStreakCelebration}
              >
                {streakCelebration && (
                  <>
                    <div className="absolute top-2 left-2 text-2xl animate-bounce-subtle" style={{ animationDelay: '0s' }}>✨</div>
                    <div className="absolute top-2 right-2 text-2xl animate-bounce-subtle" style={{ animationDelay: '0.2s' }}>🎉</div>
                    <div className="absolute bottom-2 left-4 text-2xl animate-bounce-subtle" style={{ animationDelay: '0.4s' }}>⭐</div>
                    <div className="absolute bottom-2 right-4 text-2xl animate-bounce-subtle" style={{ animationDelay: '0.6s' }}>🌟</div>
                  </>
                )}
                <div className="flex items-baseline gap-3 mb-2 relative z-10">
                  <span className={`text-6xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent ${streakCelebration ? 'animate-streak-pop' : ''}`}>
                    {streakDays}
                  </span>
                  <span className="text-xl text-gray-600 dark:text-gray-300 font-medium">days</span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 font-medium relative z-10">
                  {getStreakMessage(streakDays)}
                </p>
              </div>
            )}
          </div>

          <DailyQuote />

          <MilestonesAchievements
            streakDays={streakDays}
            journalEntries={weeklyStats.journalEntries}
            totalCheckIns={weeklyStats.totalCheckIns}
          />

          <div className="bg-white dark:bg-gray-700 rounded-xl border border-sage-100 dark:border-gray-600 overflow-hidden transition-all shadow-sm hover:shadow-md">
            <button
              onClick={() => toggleSection('mood')}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-sage-50/50 dark:hover:bg-gray-600/50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-teal-500" />
                <h3 className="text-base font-semibold text-gray-800 dark:text-white">Mood Tracker</h3>
              </div>
              {expandedSections.has('mood') ? (
                <ChevronUp className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              )}
            </button>
            {expandedSections.has('mood') && (
              <div className="px-4 pb-4 space-y-3 bg-gradient-to-br from-[#E8F5F0]/30 to-white dark:from-gray-600/20 dark:to-gray-700">
                <div className="relative h-32 px-2">
                  <svg className="w-full h-full" viewBox="0 0 350 120" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="moodGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="rgba(24, 126, 95, 0.3)" />
                        <stop offset="100%" stopColor="rgba(24, 126, 95, 0.05)" />
                      </linearGradient>
                    </defs>
                    {[...Array(11)].map((_, i) => (
                      <line
                        key={i}
                        x1="0"
                        y1={i * 12}
                        x2="350"
                        y2={i * 12}
                        stroke="currentColor"
                        className="text-[#E8F5F0] dark:text-[#46644e]"
                        strokeWidth="0.5"
                        opacity="0.5"
                      />
                    ))}
                    <polyline
                      fill="url(#moodGradient)"
                      stroke="none"
                      points={`0,120 ${moodData.map((day, i) => `${i * 50 + 25},${120 - (day.mood / maxMood) * 100}`).join(' ')} 350,120`}
                    />
                    <polyline
                      fill="none"
                      stroke="#187E5F"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={moodData.map((day, i) => `${i * 50 + 25},${120 - (day.mood / maxMood) * 100}`).join(' ')}
                    />
                    {moodData.map((day, i) => (
                      <circle
                        key={i}
                        cx={i * 50 + 25}
                        cy={120 - (day.mood / maxMood) * 100}
                        r="4"
                        fill="#76ac6d"
                        className="cursor-pointer hover:r-6 transition-all"
                      >
                        <title>{day.date}: {day.mood}/10</title>
                      </circle>
                    ))}
                  </svg>
                  <div className="flex justify-between px-2 mt-2">
                    {moodData.map((day) => (
                      <span key={day.date} className="text-xs text-gray-600 dark:text-gray-400">{day.date}</span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 px-2">
                  <span>last 7 days</span>
                  <span className="text-teal-600 dark:text-teal-400 font-medium">trending up</span>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-gray-700 rounded-xl border border-sage-100 dark:border-gray-600 overflow-hidden transition-all shadow-sm hover:shadow-md">
            <button
              onClick={() => toggleSection('reflection')}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-sage-50/50 dark:hover:bg-gray-600/50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-500" />
                <h3 className="text-base font-semibold text-gray-800 dark:text-white">Weekly Reflection</h3>
              </div>
              {expandedSections.has('reflection') ? (
                <ChevronUp className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              )}
            </button>
            {expandedSections.has('reflection') && (
              <div className="px-4 pb-4 space-y-3">
                <div className="flex items-end justify-between h-20 gap-1 px-2">
                  {moodData.map((day, index) => (
                    <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className="w-full bg-gradient-to-t from-blue-500 to-teal-400 rounded-t-sm transition-all hover:opacity-80 cursor-pointer"
                        style={{
                          height: `${(day.mood / maxMood) * 100}%`,
                          animationDelay: `${index * 0.1}s`
                        }}
                        title={`${day.date}: ${day.mood}/10`}
                      />
                      <span className="text-xs text-gray-600 dark:text-gray-400">{day.date}</span>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-2 mt-3">
                  <div className="bg-sage-50 dark:bg-gray-600/30 rounded-lg p-2 text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Check-ins</p>
                    <p className="text-lg font-bold text-sage-600 dark:text-sage-400">{weeklyStats.totalCheckIns}</p>
                  </div>
                  <div className="bg-sage-50 dark:bg-gray-600/30 rounded-lg p-2 text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Journal</p>
                    <p className="text-lg font-bold text-sage-600 dark:text-sage-400">{weeklyStats.journalEntries}</p>
                  </div>
                  <div className="bg-sage-50 dark:bg-gray-600/30 rounded-lg p-2 text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Minutes</p>
                    <p className="text-lg font-bold text-sage-600 dark:text-sage-400">{weeklyStats.mindfulnessMinutes}</p>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-teal-50 to-blue-50 dark:from-teal-900/20 dark:to-blue-900/20 rounded-lg p-3 border border-teal-200 dark:border-teal-800">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <span className="font-semibold">Great progress!</span> You logged {weeklyStats.entriesIncrease} more journal entries this week, and your mood improved by {weeklyStats.moodImprovement}%! 🌟
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-gray-700 rounded-xl border border-sage-100 dark:border-gray-600 overflow-hidden transition-all shadow-sm hover:shadow-md">
            <button
              onClick={() => toggleSection('goals')}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-sage-50/50 dark:hover:bg-gray-600/50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-sage-600 dark:text-sage-400" />
                <h3 className="text-base font-semibold text-gray-800 dark:text-white">Goals Progress</h3>
              </div>
              {expandedSections.has('goals') ? (
                <ChevronUp className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              )}
            </button>
            {expandedSections.has('goals') && (
              <div className="px-4 pb-4 space-y-4">
                <div className="group">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleGoalCompletion('daily-checkin')}
                        className="relative w-5 h-5 rounded-full border-2 border-sage-500 dark:border-sage-400 transition-all hover:scale-110"
                        title="Complete to earn Consistency Champion badge"
                      >
                        {completedGoals.has('daily-checkin') && (
                          <div className="absolute inset-0">
                            <svg className="w-full h-full" viewBox="0 0 24 24">
                              <circle cx="12" cy="12" r="10" fill="currentColor" className="text-sage-500 dark:text-sage-400 animate-checkmark-circle" />
                              <path d="M7 13l3 3 7-7" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="animate-checkmark-draw" strokeDasharray="100" />
                            </svg>
                          </div>
                        )}
                      </button>
                      <span className="text-sm text-gray-700 dark:text-gray-300">Daily Check-in</span>
                    </div>
                    <span className="text-sm font-semibold text-sage-600 dark:text-sage-400">7/7 (100%)</span>
                  </div>
                  <div className="h-2.5 bg-sage-100 dark:bg-gray-600 rounded-full overflow-hidden relative group-hover:animate-celebration-bounce">
                    <div className="h-full bg-gradient-to-r from-sage-500 to-mint-500 rounded-full transition-all duration-500 group-hover:shadow-lg" style={{ width: '100%' }} />
                  </div>
                  <p className="text-xs text-sage-600 dark:text-sage-400 mt-1 font-medium">
                    Reward: Consistency Champion Badge 🏆
                  </p>
                </div>
                <div className="group">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleGoalCompletion('journal-entries')}
                        className="relative w-5 h-5 rounded-full border-2 border-sage-500 dark:border-sage-400 transition-all hover:scale-110"
                        title="Complete to earn Reflective Writer badge"
                      >
                        {completedGoals.has('journal-entries') && (
                          <div className="absolute inset-0">
                            <svg className="w-full h-full" viewBox="0 0 24 24">
                              <circle cx="12" cy="12" r="10" fill="currentColor" className="text-sage-500 dark:text-sage-400 animate-checkmark-circle" />
                              <path d="M7 13l3 3 7-7" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="animate-checkmark-draw" strokeDasharray="100" />
                            </svg>
                          </div>
                        )}
                      </button>
                      <span className="text-sm text-gray-700 dark:text-gray-300">Journal Entries</span>
                    </div>
                    <span className="text-sm font-semibold text-sage-600 dark:text-sage-400">4/10 (40%)</span>
                  </div>
                  <div className="h-2.5 bg-sage-100 dark:bg-gray-600 rounded-full overflow-hidden relative">
                    <div className="h-full bg-gradient-to-r from-sage-500 to-mint-500 rounded-full transition-all duration-500" style={{ width: '40%' }} />
                  </div>
                  <p className="text-xs text-sage-600 dark:text-sage-400 mt-1 font-medium">
                    Reward: Reflective Writer Badge 📝
                  </p>
                </div>
                <div className="group">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleGoalCompletion('mindfulness')}
                        className="relative w-5 h-5 rounded-full border-2 border-sage-500 dark:border-sage-400 transition-all hover:scale-110"
                        title="Complete to earn Mindful Master badge"
                      >
                        {completedGoals.has('mindfulness') && (
                          <div className="absolute inset-0">
                            <svg className="w-full h-full" viewBox="0 0 24 24">
                              <circle cx="12" cy="12" r="10" fill="currentColor" className="text-sage-500 dark:text-sage-400 animate-checkmark-circle" />
                              <path d="M7 13l3 3 7-7" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="animate-checkmark-draw" strokeDasharray="100" />
                            </svg>
                          </div>
                        )}
                      </button>
                      <span className="text-sm text-gray-700 dark:text-gray-300">Mindfulness Minutes</span>
                    </div>
                    <span className="text-sm font-semibold text-sage-600 dark:text-sage-400">45/60 (75%)</span>
                  </div>
                  <div className="h-2.5 bg-sage-100 dark:bg-gray-600 rounded-full overflow-hidden relative group-hover:animate-pulse">
                    <div className="h-full bg-gradient-to-r from-sage-500 to-mint-500 rounded-full transition-all duration-500" style={{ width: '75%' }} />
                  </div>
                  <p className="text-xs text-sage-600 dark:text-sage-400 mt-1 font-medium">
                    Reward: Mindful Master Badge 🧘
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-gray-700 rounded-xl border border-sage-100 dark:border-gray-600 overflow-hidden transition-all shadow-sm hover:shadow-md">
            <button
              onClick={() => toggleSection('reminder')}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-sage-50/50 dark:hover:bg-gray-600/50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-semibold text-gray-800 dark:text-white">Daily Reminder</h3>
              </div>
              {expandedSections.has('reminder') ? (
                <ChevronUp className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              )}
            </button>
            {expandedSections.has('reminder') && (
              <div className="px-4 pb-4 bg-gradient-to-br from-amber-50/30 to-yellow-50/30 dark:from-amber-900/10 dark:to-yellow-900/10">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  How are you feeling today? Take a moment to chat with NIRA.
                </p>
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-gray-700 rounded-xl border border-sage-100 dark:border-gray-600 overflow-hidden transition-all shadow-sm hover:shadow-md">
            <button
              onClick={() => toggleSection('achievements')}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-sage-50/50 dark:hover:bg-gray-600/50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-500" />
                <h3 className="text-base font-semibold text-gray-800 dark:text-white">Achievements</h3>
              </div>
              {expandedSections.has('achievements') ? (
                <ChevronUp className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              )}
            </button>
            {expandedSections.has('achievements') && (
              <div className="px-4 pb-4 space-y-2">
                <div className="flex items-center gap-3 p-2.5 bg-gradient-to-r from-sage-50 to-mint-50 dark:from-gray-600/30 dark:to-gray-600/30 rounded-lg">
                  <span className="text-2xl">🎯</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800 dark:text-white">7-Day Streak!</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Checked in daily</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2.5 bg-gradient-to-r from-sage-50 to-mint-50 dark:from-gray-600/30 dark:to-gray-600/30 rounded-lg">
                  <span className="text-2xl">📝</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800 dark:text-white">Journaling Pro</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">10 entries written</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2.5 bg-gradient-to-r from-sage-50 to-mint-50 dark:from-gray-600/30 dark:to-gray-600/30 rounded-lg">
                  <span className="text-2xl">🌟</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800 dark:text-white">Mood Improver</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Positive trend this week</p>
                  </div>
                </div>
              </div>
            )}
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
