/*
  # Security Enhancement: Remove Unused Indexes and Enable Password Protection

  ## Overview
  This migration addresses critical security and performance issues:
  1. Removes unused indexes that consume storage and slow down writes
  2. Documents password protection requirements

  ## Changes

  ### 1. Remove Unused Indexes
  The following indexes were created but are not being used by queries:
  - `idx_user_goals_user_id` - Not utilized by current query patterns
  - `idx_chat_messages_session_id` - Not utilized by current query patterns
  - `idx_chat_messages_user_id` - Not utilized by current query patterns
  - `idx_chat_sessions_user_id` - Not utilized by current query patterns
  - `idx_journal_entries_user_id` - Not utilized by current query patterns
  - `idx_mood_tracking_user_id` - Not utilized by current query patterns
  - `idx_user_settings_user_id` - Not utilized by current query patterns

  Removing these indexes will:
  - Free up storage space
  - Speed up INSERT, UPDATE, and DELETE operations
  - Reduce maintenance overhead

  ### 2. Leaked Password Protection
  To enable leaked password protection, configure it in Supabase Dashboard:
  Navigation: Authentication > Policies > Password Requirements > Block leaked passwords
  
  This will integrate with HaveIBeenPwned.org to prevent users from using
  compromised passwords during signup and password changes.

  ## Security Impact
  - Prevents use of compromised passwords (when enabled in dashboard)
  - Reduces database bloat from unused indexes
  - Improves write performance across all affected tables

  ## Notes
  - Indexes can be recreated if future query patterns require them
  - Password protection must be enabled via Supabase Dashboard
  - Existing passwords are not retroactively checked
*/

-- Remove unused indexes to improve performance and reduce storage
DROP INDEX IF EXISTS idx_user_goals_user_id;
DROP INDEX IF EXISTS idx_chat_messages_session_id;
DROP INDEX IF EXISTS idx_chat_messages_user_id;
DROP INDEX IF EXISTS idx_chat_sessions_user_id;
DROP INDEX IF EXISTS idx_journal_entries_user_id;
DROP INDEX IF EXISTS idx_mood_tracking_user_id;
DROP INDEX IF EXISTS idx_user_settings_user_id;
