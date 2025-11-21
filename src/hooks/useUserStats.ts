import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getUserStats, updateUserStats, checkAndUnlockAchievements } from '../lib/database';
import type { UserStats, Achievement } from '../types/database';

export function useUserStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const loadStats = async () => {
      try {
        const userStats = await getUserStats(user.id);
        setStats(userStats);
      } catch (error) {
        console.error('Error loading user stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [user]);

  const refreshStats = async () => {
    if (!user) return;
    
    try {
      const userStats = await getUserStats(user.id);
      setStats(userStats);
      
      // Check for new achievements
      if (userStats) {
        const unlocked = await checkAndUnlockAchievements(user.id, userStats);
        if (unlocked.length > 0) {
          setNewAchievements(unlocked);
          // Refresh stats after unlocking achievements
          const updatedStats = await getUserStats(user.id);
          setStats(updatedStats);
        }
      }
    } catch (error) {
      console.error('Error refreshing stats:', error);
    }
  };

  const updateStats = async (updates: Partial<UserStats>) => {
    if (!user || !stats) return;

    try {
      const updated = await updateUserStats(user.id, updates);
      setStats(updated);
      
      // Check for new achievements after update
      const unlocked = await checkAndUnlockAchievements(user.id, updated);
      if (unlocked.length > 0) {
        setNewAchievements(unlocked);
        // Refresh stats again
        const finalStats = await getUserStats(user.id);
        setStats(finalStats);
      }
    } catch (error) {
      console.error('Error updating stats:', error);
      throw error;
    }
  };

  return {
    stats,
    loading,
    newAchievements,
    refreshStats,
    updateStats,
  };
}

