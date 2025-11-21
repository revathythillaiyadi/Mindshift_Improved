// Database type definitions matching Supabase schema

export interface JournalEntry {
  id: string;
  user_id: string;
  title: string | null;
  content: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface ChatHistory {
  id: string;
  user_id: string;
  timestamp: string;
  speaker: 'user' | 'ai';
  message: string;
}

export interface UserStats {
  id: string;
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_journal_date: string | null;
  journal_count_monthly: number;
  created_at: string;
  updated_at: string;
}

export interface Achievement {
  id: string;
  user_id: string;
  achievement_name: string;
  unlocked_at: string;
}

// Database insert types (without auto-generated fields)
export type JournalEntryInsert = Omit<JournalEntry, 'id' | 'created_at' | 'updated_at'>;
export type ChatHistoryInsert = Omit<ChatHistory, 'id' | 'timestamp'>;
export type UserStatsInsert = Omit<UserStats, 'id' | 'created_at' | 'updated_at'>;
export type AchievementInsert = Omit<Achievement, 'id' | 'unlocked_at'>;

// Database update types (partial, excluding immutable fields)
export type JournalEntryUpdate = Partial<Omit<JournalEntry, 'id' | 'user_id' | 'created_at'>>;
export type ChatHistoryUpdate = Partial<Omit<ChatHistory, 'id' | 'user_id' | 'timestamp'>>;
export type UserStatsUpdate = Partial<Omit<UserStats, 'id' | 'user_id' | 'created_at'>>;

