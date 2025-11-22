import { useState, useEffect } from 'react';
import { Flame, ChevronDown, ChevronUp } from 'lucide-react';
import DailyQuote from './DailyQuote';
import MilestonesAchievements from './MilestonesAchievements';
import { useUserStats } from '../../hooks/useUserStats';
import { getTodayConversations, getTodayMindfulnessMinutes } from '../../lib/database';
import { useAuth } from '../../contexts/AuthContext';

export default function DashboardStats() {
  const { stats, loading, refreshStats } = useUserStats();
  const { user } = useAuth();
  const [streakCelebration, setStreakCelebration] = useState(false);
  const [weeklyStats, setWeeklyStats] = useState({
    totalCheckIns: 0,
    journalEntries: 0,
    mindfulnessMinutes: 0,
  });
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

  // Load stats from conversations
  useEffect(() => {
    const loadConversationStats = async () => {
      if (!user) return;
      
      try {
        const [checkIns, minutes] = await Promise.all([
          getTodayConversations(user.id).catch(err => {
            console.warn('Error loading today conversations (non-critical):', err);
            return 0; // Return default value on error
          }),
          getTodayMindfulnessMinutes(user.id).catch(err => {
            console.warn('Error loading mindfulness minutes (non-critical):', err);
            return 0; // Return default value on error
          }),
        ]);
        
        setWeeklyStats({
          totalCheckIns: checkIns,
          journalEntries: stats?.journal_count_monthly || 0,
          mindfulnessMinutes: minutes,
        });
        
        // Refresh stats to ensure streak and achievements are updated
        await refreshStats().catch(err => {
          console.warn('Error refreshing stats (non-critical):', err);
        });
      } catch (error) {
        // Only log if it's a critical error, not network issues
        if (error instanceof Error && !error.message.includes('Failed to fetch') && !error.message.includes('ERR_INSUFFICIENT_RESOURCES')) {
          console.error('Error loading conversation stats:', error);
        } else {
          console.debug('Stats loading error (network/resource issue, non-critical):', error);
        }
      }
    };

    loadConversationStats();
    // Refresh every 60 seconds to reduce load (increased from 30s to prevent resource exhaustion)
    const interval = setInterval(() => {
      loadConversationStats().catch(error => {
        // Silently handle errors to prevent console spam
        console.debug('Stats refresh error (non-critical):', error);
      });
    }, 60000); // Increased to 60 seconds
    
    return () => clearInterval(interval);
  }, [user, stats?.journal_count_monthly, stats?.current_streak, refreshStats]);

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

