// Database service functions for interacting with Supabase tables

import { supabase } from './supabase';
import type { 
  JournalEntry, 
  ChatHistory, 
  UserStats, 
  Achievement,
  JournalEntryInsert,
  ChatHistoryInsert,
  UserStatsInsert,
  AchievementInsert,
  JournalEntryUpdate,
  UserStatsUpdate
} from '../types/database';

// ============================================
// JOURNAL ENTRIES
// ============================================

export async function getJournalEntries(userId: string): Promise<JournalEntry[]> {
  const { data, error } = await supabase
    .from('journal_entries')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getJournalEntryById(entryId: string, userId: string): Promise<JournalEntry | null> {
  const { data, error } = await supabase
    .from('journal_entries')
    .select('*')
    .eq('id', entryId)
    .eq('user_id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    throw error;
  }
  return data;
}

export async function createJournalEntry(entry: JournalEntryInsert): Promise<JournalEntry> {
  const { data, error } = await supabase
    .from('journal_entries')
    .insert(entry)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateJournalEntry(
  entryId: string, 
  userId: string, 
  updates: JournalEntryUpdate
): Promise<JournalEntry> {
  const { data, error } = await supabase
    .from('journal_entries')
    .update(updates)
    .eq('id', entryId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteJournalEntry(entryId: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from('journal_entries')
    .delete()
    .eq('id', entryId)
    .eq('user_id', userId);

  if (error) throw error;
}

// ============================================
// CHAT HISTORY
// ============================================

export async function getChatHistory(userId: string, limit: number = 50): Promise<ChatHistory[]> {
  const { data, error } = await supabase
    .from('chat_history')
    .select('*')
    .eq('user_id', userId)
    .order('timestamp', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data || []).reverse(); // Reverse to show oldest first
}

export async function createChatMessage(message: ChatHistoryInsert): Promise<ChatHistory> {
  const { data, error } = await supabase
    .from('chat_history')
    .insert(message)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteChatHistory(userId: string): Promise<void> {
  const { error } = await supabase
    .from('chat_history')
    .delete()
    .eq('user_id', userId);

  if (error) throw error;
}

// ============================================
// USER STATS
// ============================================

export async function getUserStats(userId: string): Promise<UserStats | null> {
  const { data, error } = await supabase
    .from('user_stats')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // Stats don't exist, create them
      return await createUserStats({ user_id: userId });
    }
    throw error;
  }
  return data;
}

export async function createUserStats(stats: UserStatsInsert): Promise<UserStats> {
  const { data, error } = await supabase
    .from('user_stats')
    .insert(stats)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateUserStats(
  userId: string, 
  updates: UserStatsUpdate
): Promise<UserStats> {
  const { data, error } = await supabase
    .from('user_stats')
    .update(updates)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Helper function to update streak
export async function updateStreak(userId: string, increment: boolean = true): Promise<UserStats> {
  const stats = await getUserStats(userId);
  if (!stats) throw new Error('User stats not found');

  const newStreak = increment ? stats.current_streak + 1 : 0;
  const longestStreak = Math.max(stats.longest_streak, newStreak);

  return await updateUserStats(userId, {
    current_streak: newStreak,
    longest_streak: longestStreak,
    last_journal_date: new Date().toISOString().split('T')[0],
    journal_count_monthly: stats.journal_count_monthly + 1
  });
}

// ============================================
// ACHIEVEMENTS
// ============================================

export async function getAchievements(userId: string): Promise<Achievement[]> {
  const { data, error } = await supabase
    .from('achievements')
    .select('*')
    .eq('user_id', userId)
    .order('unlocked_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createAchievement(achievement: AchievementInsert): Promise<Achievement> {
  const { data, error } = await supabase
    .from('achievements')
    .insert(achievement)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function checkAndUnlockAchievements(userId: string, stats: UserStats): Promise<Achievement[]> {
  const unlocked: Achievement[] = [];
  const existingAchievements = await getAchievements(userId);
  const existingNames = new Set(existingAchievements.map(a => a.achievement_name));

  // Define achievement criteria
  const achievements = [
    { name: 'First Steps', condition: () => stats.current_streak >= 1 },
    { name: 'Week Warrior', condition: () => stats.current_streak >= 7 },
    { name: 'Fortnight Fighter', condition: () => stats.current_streak >= 14 },
    { name: 'Monthly Master', condition: () => stats.current_streak >= 30 },
    { name: 'Journal Explorer', condition: () => stats.journal_count_monthly >= 10 },
    { name: 'Consistent Creator', condition: () => stats.journal_count_monthly >= 20 },
  ];

  for (const achievement of achievements) {
    if (!existingNames.has(achievement.name) && achievement.condition()) {
      const newAchievement = await createAchievement({
        user_id: userId,
        achievement_name: achievement.name
      });
      unlocked.push(newAchievement);
    }
  }

  return unlocked;
}

