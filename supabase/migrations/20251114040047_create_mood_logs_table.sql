/*
  # Create mood logs table

  1. New Tables
    - `mood_logs`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `mood_value` (integer, 1-5 scale)
      - `created_at` (timestamptz, default now())
  
  2. Security
    - Enable RLS on `mood_logs` table
    - Add policy for authenticated users to insert their own mood logs
    - Add policy for authenticated users to read their own mood logs
  
  3. Indexes
    - Add index on user_id for faster queries
    - Add index on created_at for time-based queries
*/

CREATE TABLE IF NOT EXISTS mood_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  mood_value integer NOT NULL CHECK (mood_value >= 1 AND mood_value <= 5),
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE mood_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own mood logs"
  ON mood_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own mood logs"
  ON mood_logs
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_mood_logs_user_id ON mood_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_mood_logs_created_at ON mood_logs(created_at DESC);
