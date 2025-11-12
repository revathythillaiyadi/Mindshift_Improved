import { useState, useEffect } from 'react';
import { Award, Lock, Flame, BookOpen, Trophy, Target } from 'lucide-react';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: typeof Award;
  isEarned: boolean;
  daysAway?: number;
  progress?: { current: number; total: number };
  isNew?: boolean;
}

interface MilestonesAchievementsProps {
  streakDays: number;
  journalEntries: number;
  totalCheckIns: number;
}

export default function MilestonesAchievements({
  streakDays,
  journalEntries,
  totalCheckIns,
}: MilestonesAchievementsProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [newBadgeId, setNewBadgeId] = useState<string | null>(null);

  const badges: Badge[] = [
    {
      id: 'first-step',
      name: 'First Step',
      description: 'Completed your first check-in',
      icon: Target,
      isEarned: totalCheckIns >= 1,
      progress: { current: Math.min(totalCheckIns, 1), total: 1 },
    },
    {
      id: 'week-warrior',
      name: 'Week Warrior',
      description: 'Maintained a 7-day streak',
      icon: Flame,
      isEarned: streakDays >= 7,
      progress: { current: Math.min(streakDays, 7), total: 7 },
      daysAway: streakDays < 7 ? 7 - streakDays : undefined,
    },
    {
      id: 'thoughtful',
      name: 'Thoughtful',
      description: 'Written 10 journal entries',
      icon: BookOpen,
      isEarned: journalEntries >= 10,
      progress: { current: Math.min(journalEntries, 10), total: 10 },
    },
    {
      id: 'month-master',
      name: 'Month Master',
      description: 'Maintained a 30-day streak',
      icon: Award,
      isEarned: streakDays >= 30,
      progress: { current: Math.min(streakDays, 30), total: 30 },
      daysAway: streakDays < 30 ? 30 - streakDays : undefined,
    },
    {
      id: 'centurion',
      name: 'Centurion',
      description: 'Completed 100 check-ins',
      icon: Trophy,
      isEarned: totalCheckIns >= 100,
      progress: { current: Math.min(totalCheckIns, 100), total: 100 },
    },
  ];

  const nextMilestone = badges.find((badge) => !badge.isEarned);

  useEffect(() => {
    const earnedBadges = badges.filter((b) => b.isEarned);
    const lastEarnedKey = 'last-earned-badges';
    const lastEarned = localStorage.getItem(lastEarnedKey);
    const lastEarnedIds = lastEarned ? JSON.parse(lastEarned) : [];

    const newlyEarned = earnedBadges.find((b) => !lastEarnedIds.includes(b.id));

    if (newlyEarned) {
      setNewBadgeId(newlyEarned.id);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);

      localStorage.setItem(
        lastEarnedKey,
        JSON.stringify(earnedBadges.map((b) => b.id))
      );
    }
  }, [streakDays, journalEntries, totalCheckIns]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-[2rem] p-6 shadow-lg">
      {showConfetti && (
        <div className="confetti-container">
          {Array.from({ length: 40 }).map((_, i) => (
            <div
              key={i}
              className="confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
              }}
            />
          ))}
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-sage-700 dark:text-white flex items-center gap-2">
          <Trophy className="w-6 h-6 text-amber-500" />
          Milestones & Achievements
        </h2>
      </div>

      <div className="overflow-x-auto pb-4 -mx-2 px-2">
        <div className="flex gap-4 min-w-max">
          {badges.map((badge) => {
            const Icon = badge.icon;
            const isNew = badge.id === newBadgeId;

            return (
              <div
                key={badge.id}
                className={`group relative flex-shrink-0 ${
                  isNew ? 'animate-badge-earn' : ''
                }`}
              >
                <div
                  className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${
                    badge.isEarned
                      ? 'bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg hover:shadow-xl hover:scale-110 badge-glow'
                      : 'bg-gray-300 dark:bg-gray-700 opacity-60 hover:opacity-80'
                  }`}
                >
                  {badge.isEarned ? (
                    <Icon className="w-10 h-10 text-white" strokeWidth={2.5} />
                  ) : (
                    <>
                      <Icon
                        className="w-10 h-10 text-gray-500 dark:text-gray-400"
                        strokeWidth={2.5}
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-full">
                        <Lock className="w-6 h-6 text-white" />
                      </div>
                    </>
                  )}
                </div>

                <div className="absolute left-1/2 top-full mt-2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 pointer-events-none">
                  <div className="bg-gray-900 dark:bg-gray-950 text-white px-4 py-3 rounded-xl shadow-xl text-center whitespace-nowrap min-w-[200px]">
                    <div className="font-bold text-sm mb-1">{badge.name}</div>
                    <div className="text-xs text-gray-300 mb-2">
                      {badge.description}
                    </div>
                    {!badge.isEarned && badge.progress && (
                      <div className="mt-2">
                        <div className="w-full bg-gray-700 rounded-full h-2 mb-1">
                          <div
                            className="bg-amber-500 h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${
                                (badge.progress.current / badge.progress.total) * 100
                              }%`,
                            }}
                          />
                        </div>
                        <div className="text-xs text-gray-400">
                          {badge.progress.current} / {badge.progress.total}
                          {badge.daysAway && (
                            <span className="text-amber-400 font-semibold ml-1">
                              ({badge.daysAway}{' '}
                              {badge.daysAway === 1 ? 'day' : 'days'} away!)
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                    {badge.isEarned && (
                      <div className="text-xs text-green-400 font-semibold">
                        ✓ Earned!
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-center mt-2">
                  <div
                    className={`text-xs font-semibold ${
                      badge.isEarned
                        ? 'text-amber-600 dark:text-amber-400'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {badge.name}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {nextMilestone && (
        <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl border-2 border-amber-200 dark:border-amber-700/50">
          <div className="flex items-start gap-3">
            <div className="text-2xl">🎯</div>
            <div className="flex-1">
              <div className="font-bold text-sage-700 dark:text-white mb-1">
                Next Milestone: {nextMilestone.name}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                {nextMilestone.daysAway && nextMilestone.daysAway > 0 ? (
                  <>
                    <span className="font-semibold text-amber-600 dark:text-amber-400">
                      {nextMilestone.daysAway}{' '}
                      {nextMilestone.daysAway === 1 ? 'day' : 'days'} to go!
                    </span>{' '}
                    Keep it up!
                  </>
                ) : nextMilestone.progress ? (
                  <>
                    <span className="font-semibold text-amber-600 dark:text-amber-400">
                      {nextMilestone.progress.total - nextMilestone.progress.current}{' '}
                      more to go!
                    </span>{' '}
                    Keep it up!
                  </>
                ) : (
                  'Keep going! You can do it!'
                )}
              </div>
              {nextMilestone.progress && (
                <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-amber-400 to-amber-600 h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${
                        (nextMilestone.progress.current /
                          nextMilestone.progress.total) *
                        100
                      }%`,
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
