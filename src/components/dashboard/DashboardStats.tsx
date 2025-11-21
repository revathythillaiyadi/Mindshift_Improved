import { useState } from 'react';
import { Flame, ChevronDown, ChevronUp } from 'lucide-react';
import DailyQuote from './DailyQuote';
import MilestonesAchievements from './MilestonesAchievements';
import { useUserStats } from '../../hooks/useUserStats';

export default function DashboardStats() {
  const { stats, loading } = useUserStats();
  const [streakCelebration, setStreakCelebration] = useState(false);
  // Initialize from localStorage to persist user preference, matching original RightPanel behavior
  const [isStreakExpanded, setIsStreakExpanded] = useState(() => {
    const hasSeenReflection = localStorage.getItem('has-seen-reflection');
    if (!hasSeenReflection) {
      // First visit: expand streak by default
      return true;
    }
    // Check if streak was in the persisted expanded sections
    const expandedSectionsStr = localStorage.getItem('dashboard-expanded-sections');
    if (expandedSectionsStr) {
      try {
        const expandedSections = new Set(JSON.parse(expandedSectionsStr));
        return expandedSections.has('streak');
      } catch {
        // Fallback to default if parsing fails
        return true;
      }
    }
    // Default to expanded if no preference stored
    return true;
  });

  const getStreakMessage = (days: number) => {
    if (days >= 30) return "You're unstoppable! A full month of dedication!";
    if (days >= 14) return "Two weeks strong! You're building incredible habits!";
    if (days >= 7) return "One week streak! You're doing amazing!";
    if (days >= 3) return "Great start! Keep the momentum going!";
    return "Every journey begins with a single step!";
  };

  const streakDays = stats?.current_streak || 0;

  const triggerStreakCelebration = () => {
    setStreakCelebration(true);
    setTimeout(() => setStreakCelebration(false), 1500);
  };

  const weeklyStats = {
    totalCheckIns: 12, // TODO: Calculate from mood_logs or chat_history
    journalEntries: stats?.journal_count_monthly || 0,
    mindfulnessMinutes: 45, // TODO: Calculate from activity logs
  };

  return (
    <div className="space-y-6 px-6 pb-6">
      {/* Current Streak Section */}
      <div className="bg-white dark:bg-gray-700 rounded-xl border border-sage-100 dark:border-gray-600 overflow-hidden transition-all shadow-sm hover:shadow-md">
        <button
          onClick={() => {
            const newState = !isStreakExpanded;
            setIsStreakExpanded(newState);
            // Persist to localStorage to maintain user preference
            const expandedSectionsStr = localStorage.getItem('dashboard-expanded-sections');
            let expandedSections = new Set<string>();
            if (expandedSectionsStr) {
              try {
                expandedSections = new Set(JSON.parse(expandedSectionsStr));
              } catch {
                expandedSections = new Set();
              }
            }
            if (newState) {
              expandedSections.add('streak');
            } else {
              expandedSections.delete('streak');
            }
            localStorage.setItem('dashboard-expanded-sections', JSON.stringify(Array.from(expandedSections)));
          }}
          className="w-full px-4 py-3 flex items-center justify-between hover:bg-sage-50/50 dark:hover:bg-gray-600/50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-500" />
            <h3 className="text-base font-semibold text-gray-800 dark:text-white">Current Streak</h3>
          </div>
          {isStreakExpanded ? (
            <ChevronUp className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          )}
        </button>
        {isStreakExpanded && (
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

      {/* Daily Inspiration */}
      <DailyQuote />

      {/* Milestones & Achievements */}
      <MilestonesAchievements
        streakDays={streakDays}
        journalEntries={weeklyStats.journalEntries}
        totalCheckIns={weeklyStats.totalCheckIns}
      />
    </div>
  );
}

