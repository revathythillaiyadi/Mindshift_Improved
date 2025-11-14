import { useState, useEffect } from 'react';
import { Lock, Trophy } from 'lucide-react';

interface Badge {
  id: string;
  name: string;
  description: string;
  tier: 'bronze' | 'silver' | 'gold';
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

const FootprintsIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 8C12 8 10 10 10 13C10 16 12 18 14 18C16 18 18 16 18 13C18 10 16 8 16 8" fill="white" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
    <ellipse cx="11" cy="10" rx="1.5" ry="2" fill="white"/>
    <ellipse cx="13" cy="9" rx="1.5" ry="2" fill="white"/>
    <ellipse cx="15" cy="9.5" rx="1.5" ry="2" fill="white"/>
    <path d="M22 22C22 22 20 24 20 27C20 30 22 32 24 32C26 32 28 30 28 27C28 24 26 22 26 22" fill="white" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
    <ellipse cx="21" cy="24" rx="1.5" ry="2" fill="white"/>
    <ellipse cx="23" cy="23" rx="1.5" ry="2" fill="white"/>
    <ellipse cx="25" cy="23.5" rx="1.5" ry="2" fill="white"/>
  </svg>
);

const ShieldCheckIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 4L8 10V18C8 26 14 32 20 36C26 32 32 26 32 18V10L20 4Z" fill="white" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
    <path d="M14 20L18 24L26 16" stroke="#FFD700" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="18" cy="13" r="1.5" fill="#FFD700"/>
    <circle cx="22" cy="13" r="1.5" fill="#FFD700"/>
    <circle cx="26" cy="17" r="1.5" fill="#FFD700"/>
  </svg>
);

const BrainHeartIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 12C20 12 16 8 12 8C8 8 6 10 6 14C6 18 8 20 10 22C12 24 16 26 20 28C24 26 28 24 30 22C32 20 34 18 34 14C34 10 32 8 28 8C24 8 20 12 20 12Z" fill="white" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
    <circle cx="15" cy="16" r="2" fill="#C0C0C0"/>
    <circle cx="25" cy="16" r="2" fill="#C0C0C0"/>
    <path d="M16 20C16 20 18 22 20 22C22 22 24 20 24 20" stroke="#C0C0C0" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

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
      tier: 'bronze',
      isEarned: totalCheckIns >= 1,
      progress: { current: Math.min(totalCheckIns, 1), total: 1 },
    },
    {
      id: 'week-warrior',
      name: 'Week Warrior',
      description: 'Maintained a 7-day streak',
      tier: 'gold',
      isEarned: streakDays >= 7,
      progress: { current: Math.min(streakDays, 7), total: 7 },
      daysAway: streakDays < 7 ? 7 - streakDays : undefined,
    },
    {
      id: 'thoughtful',
      name: 'Thoughtful',
      description: 'Written 10 journal entries',
      tier: 'silver',
      isEarned: journalEntries >= 10,
      progress: { current: Math.min(journalEntries, 10), total: 10 },
    },
  ];

  const tierGradients = {
    bronze: 'from-[#CD7F32] to-[#B87333]',
    silver: 'from-[#C0C0C0] to-[#A8A8A8]',
    gold: 'from-[#FFD700] to-[#FFA500]',
  };

  const earnedBadges = badges.filter(b => b.isEarned);
  const totalBadges = badges.length;
  const achievementPercentage = Math.round((earnedBadges.length / totalBadges) * 100);

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

  const getBadgeIcon = (badgeId: string, isEarned: boolean) => {
    const opacity = isEarned ? 1 : 0.4;
    const filter = isEarned ? 'none' : 'grayscale(100%)';

    switch (badgeId) {
      case 'first-step':
        return <div style={{ opacity, filter }}><FootprintsIcon /></div>;
      case 'week-warrior':
        return <div style={{ opacity, filter }}><ShieldCheckIcon /></div>;
      case 'thoughtful':
        return <div style={{ opacity, filter }}><BrainHeartIcon /></div>;
      default:
        return <Trophy className="w-10 h-10 text-white" />;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-700 rounded-xl border border-sage-100 dark:border-gray-600 overflow-hidden shadow-sm hover:shadow-md transition-all">
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

      <div className="px-5 py-4 bg-sage-50/50 dark:bg-gray-600/30 border-b border-sage-100 dark:border-gray-600">
        <h3 className="font-semibold text-base text-gray-800 dark:text-white flex items-center gap-2">
          <Trophy className="w-5 h-5 text-[#FFD700]" />
          Milestones & Achievements
        </h3>
      </div>

      <div className="p-5">
        <div className="flex justify-center gap-6 mb-6">
          {badges.map((badge) => {
            const isNew = badge.id === newBadgeId;

            return (
              <div
                key={badge.id}
                className={`group relative flex flex-col items-center ${
                  isNew ? 'animate-badge-earn' : ''
                }`}
              >
                <div className="relative">
                  <div
                    className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
                      badge.isEarned
                        ? `bg-gradient-to-br ${tierGradients[badge.tier]} shadow-[0_4px_12px_rgba(0,0,0,0.2)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.25)] hover:scale-110`
                        : 'bg-gray-300 dark:bg-gray-700 opacity-40 hover:opacity-60'
                    }`}
                    style={{
                      boxShadow: badge.isEarned
                        ? '0 4px 12px rgba(0,0,0,0.2), inset 0 2px 4px rgba(255,255,255,0.3)'
                        : 'none'
                    }}
                  >
                    {getBadgeIcon(badge.id, badge.isEarned)}

                    {!badge.isEarned && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-full">
                        <Lock className="w-5 h-5 text-white" />
                      </div>
                    )}

                    {badge.isEarned && (
                      <>
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-300 rounded-full animate-sparkle" style={{ animationDelay: '0s' }} />
                        <div className="absolute top-0 -left-1 w-2 h-2 bg-yellow-200 rounded-full animate-sparkle" style={{ animationDelay: '0.5s' }} />
                        <div className="absolute -bottom-1 right-2 w-2.5 h-2.5 bg-yellow-400 rounded-full animate-sparkle" style={{ animationDelay: '1s' }} />
                      </>
                    )}
                  </div>
                </div>

                <div className="text-center mt-3 max-w-[90px]">
                  <div
                    className={`text-xs font-semibold leading-tight ${
                      badge.isEarned
                        ? 'text-gray-800 dark:text-white'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {badge.name}
                  </div>
                </div>

                <div className="absolute left-1/2 top-full mt-3 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 pointer-events-none">
                  <div className="bg-gray-900 dark:bg-gray-950 text-white px-4 py-3 rounded-xl shadow-xl text-center whitespace-nowrap min-w-[200px]">
                    <div className="font-bold text-sm mb-1">{badge.name}</div>
                    <div className="text-xs text-gray-300 mb-2">
                      {badge.description}
                    </div>
                    {!badge.isEarned && badge.progress && (
                      <div className="mt-2">
                        <div className="w-full bg-gray-700 rounded-full h-2 mb-1">
                          <div
                            className={`bg-gradient-to-r ${tierGradients[badge.tier]} h-2 rounded-full transition-all duration-300`}
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
              </div>
            );
          })}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400 font-medium">
              Progress
            </span>
            <span className="text-[#187E5F] dark:text-sage-400 font-semibold">
              {earnedBadges.length} of {totalBadges} achievements ({achievementPercentage}%)
            </span>
          </div>
          <div className="w-full bg-[#E8F5F0] dark:bg-gray-600 rounded-full h-2 overflow-hidden">
            <div
              className="bg-[#187E5F] h-2 rounded-full transition-all duration-500"
              style={{ width: `${achievementPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {nextMilestone && (
        <div className="mx-5 mb-5 p-5 bg-gradient-to-br from-[rgba(24,126,95,0.12)] to-[rgba(11,88,68,0.06)] dark:from-[rgba(24,126,95,0.2)] dark:to-[rgba(11,88,68,0.1)] rounded-xl border-l-4 border-l-[#FF8C42] relative">
          <div className="flex items-start gap-4">
            <div className="relative flex-shrink-0">
              <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 48 48">
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="#E8F5F0"
                  strokeWidth="4"
                  fill="none"
                  className="dark:stroke-gray-600"
                />
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="#187E5F"
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 20}`}
                  strokeDashoffset={`${2 * Math.PI * 20 * (1 - (nextMilestone.progress ? nextMilestone.progress.current / nextMilestone.progress.total : 0))}`}
                  strokeLinecap="round"
                  className="transition-all duration-500"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-[#FF8C42]" />
              </div>
            </div>

            <div className="flex-1">
              <div className="font-bold text-sage-700 dark:text-white mb-1 text-sm">
                Next Milestone: {nextMilestone.name}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                {nextMilestone.daysAway && nextMilestone.daysAway > 0 ? (
                  <>
                    <span className="font-semibold text-[#FF8C42]">
                      {nextMilestone.daysAway}{' '}
                      {nextMilestone.daysAway === 1 ? 'day' : 'days'} to go!
                    </span>{' '}
                    Keep it up!
                  </>
                ) : nextMilestone.progress ? (
                  <>
                    <span className="font-semibold text-[#FF8C42]">
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
                <div className="w-full bg-[#E8F5F0] dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-[#FF8C42] to-[#FFB347] h-1.5 rounded-full transition-all duration-500"
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
