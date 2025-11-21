/*
  # Create Core Schema Tables
  
  This migration creates the core database schema matching the provided design:
  1. journal_entries - Stores journal content with tags
  2. chat_history - Stores chat conversation history
  3. user_stats - One-to-one stats with user profiles
  4. achievements - Stores user achievements/milestones
  
  All tables are linked to profiles (user_profiles) via user_id foreign key.
*/

-- ============================================
-- 1. JOURNAL_ENTRIES TABLE
-- ============================================
-- Ensure journal_entries table exists with correct schema
DO $$
BEGIN
  -- Check if table exists, if not create it
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'journal_entries') THEN
    CREATE TABLE journal_entries (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
      title text,
      content text NOT NULL,
      tags text[] DEFAULT '{}',
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    );
  ELSE
    -- Add missing columns if they don't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'journal_entries' AND column_name = 'tags') THEN
      ALTER TABLE journal_entries ADD COLUMN tags text[] DEFAULT '{}';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'journal_entries' AND column_name = 'title') THEN
      ALTER TABLE journal_entries ADD COLUMN title text;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'journal_entries' AND column_name = 'content') THEN
      ALTER TABLE journal_entries ADD COLUMN content text NOT NULL DEFAULT '';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'journal_entries' AND column_name = 'created_at') THEN
      ALTER TABLE journal_entries ADD COLUMN created_at timestamptz DEFAULT now();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'journal_entries' AND column_name = 'updated_at') THEN
      ALTER TABLE journal_entries ADD COLUMN updated_at timestamptz DEFAULT now();
    END IF;
  END IF;
END $$;

-- Enable RLS on journal_entries
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own journal entries" ON journal_entries;
DROP POLICY IF EXISTS "Users can create own journal entries" ON journal_entries;
DROP POLICY IF EXISTS "Users can update own journal entries" ON journal_entries;
DROP POLICY IF EXISTS "Users can delete own journal entries" ON journal_entries;

-- Create optimized RLS policies for journal_entries
CREATE POLICY "Users can view own journal entries"
  ON journal_entries FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can create own journal entries"
  ON journal_entries FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can update own journal entries"
  ON journal_entries FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can delete own journal entries"
  ON journal_entries FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- Create index on user_id for performance
CREATE INDEX IF NOT EXISTS idx_journal_entries_user_id ON journal_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_journal_entries_created_at ON journal_entries(created_at DESC);

-- ============================================
-- 2. CHAT_HISTORY TABLE
-- ============================================
-- Create chat_history table (simplified chat storage)
CREATE TABLE IF NOT EXISTS chat_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  timestamp timestamptz DEFAULT now(),
  speaker text NOT NULL CHECK (speaker IN ('user', 'ai')),
  message text NOT NULL
);

-- Enable RLS on chat_history
ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own chat history" ON chat_history;
DROP POLICY IF EXISTS "Users can create own chat history" ON chat_history;
DROP POLICY IF EXISTS "Users can update own chat history" ON chat_history;
DROP POLICY IF EXISTS "Users can delete own chat history" ON chat_history;

-- Create RLS policies for chat_history
CREATE POLICY "Users can view own chat history"
  ON chat_history FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can create own chat history"
  ON chat_history FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can update own chat history"
  ON chat_history FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can delete own chat history"
  ON chat_history FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- Create indexes for chat_history
CREATE INDEX IF NOT EXISTS idx_chat_history_user_id ON chat_history(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_history_timestamp ON chat_history(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_chat_history_user_timestamp ON chat_history(user_id, timestamp DESC);

-- ============================================
-- 3. USER_STATS TABLE (One-to-One with profiles)
-- ============================================
CREATE TABLE IF NOT EXISTS user_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  current_streak integer DEFAULT 0,
  longest_streak integer DEFAULT 0,
  last_journal_date date,
  journal_count_monthly integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on user_stats
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own stats" ON user_stats;
DROP POLICY IF EXISTS "Users can create own stats" ON user_stats;
DROP POLICY IF EXISTS "Users can update own stats" ON user_stats;
DROP POLICY IF EXISTS "Users can delete own stats" ON user_stats;

-- Create RLS policies for user_stats
CREATE POLICY "Users can view own stats"
  ON user_stats FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can create own stats"
  ON user_stats FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can update own stats"
  ON user_stats FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can delete own stats"
  ON user_stats FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- Create index on user_id (though UNIQUE constraint already creates one)
CREATE INDEX IF NOT EXISTS idx_user_stats_user_id ON user_stats(user_id);

-- ============================================
-- 4. ACHIEVEMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  achievement_name text NOT NULL,
  unlocked_at timestamptz DEFAULT now()
);

-- Enable RLS on achievements
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own achievements" ON achievements;
DROP POLICY IF EXISTS "Users can create own achievements" ON achievements;
DROP POLICY IF EXISTS "Users can update own achievements" ON achievements;
DROP POLICY IF EXISTS "Users can delete own achievements" ON achievements;

-- Create RLS policies for achievements
CREATE POLICY "Users can view own achievements"
  ON achievements FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can create own achievements"
  ON achievements FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can update own achievements"
  ON achievements FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can delete own achievements"
  ON achievements FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- Create indexes for achievements
CREATE INDEX IF NOT EXISTS idx_achievements_user_id ON achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_achievements_unlocked_at ON achievements(unlocked_at DESC);
CREATE INDEX IF NOT EXISTS idx_achievements_user_unlocked ON achievements(user_id, unlocked_at DESC);

-- ============================================
-- 5. TRIGGERS FOR UPDATED_AT
-- ============================================
-- Create or replace function for updating updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at trigger to journal_entries
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_journal_entries_updated_at'
  ) THEN
    CREATE TRIGGER update_journal_entries_updated_at
      BEFORE UPDATE ON journal_entries
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- Add updated_at trigger to user_stats
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_user_stats_updated_at'
  ) THEN
    CREATE TRIGGER update_user_stats_updated_at
      BEFORE UPDATE ON user_stats
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- ============================================
-- 6. FUNCTION TO AUTO-CREATE USER_STATS
-- ============================================
-- Function to automatically create user_stats when a new user is created
CREATE OR REPLACE FUNCTION create_user_stats()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_stats (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user_stats when a new user signs up
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'on_user_created_create_stats'
  ) THEN
    CREATE TRIGGER on_user_created_create_stats
      AFTER INSERT ON auth.users
      FOR EACH ROW
      EXECUTE FUNCTION create_user_stats();
  END IF;
END $$;

