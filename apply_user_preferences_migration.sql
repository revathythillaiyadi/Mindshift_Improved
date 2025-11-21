/*
  # Apply User Preferences Table and Storage Buckets
  
  This script creates the user_preferences table and storage buckets
  needed for background images and audio settings.
  
  INSTRUCTIONS:
  1. Go to your Supabase Dashboard: https://supabase.com/dashboard
  2. Select your project
  3. Go to SQL Editor (left sidebar)
  4. Click "New Query"
  5. Paste this entire file content
  6. Click "Run" (or press Cmd/Ctrl + Enter)
*/

-- ============================================
-- 1. CREATE USER_PREFERENCES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS user_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  ambient_sound text,
  sound_volume integer DEFAULT 50 CHECK (sound_volume >= 0 AND sound_volume <= 100),
  background_theme text DEFAULT 'nature',
  voice_option text DEFAULT 'female',
  custom_background_url text,
  custom_audio_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);

-- ============================================
-- 2. CREATE RLS POLICIES
-- ============================================
-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view own preferences" ON user_preferences;
DROP POLICY IF EXISTS "Users can insert own preferences" ON user_preferences;
DROP POLICY IF EXISTS "Users can update own preferences" ON user_preferences;
DROP POLICY IF EXISTS "Users can delete own preferences" ON user_preferences;

-- Create RLS policies
CREATE POLICY "Users can view own preferences"
  ON user_preferences FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences"
  ON user_preferences FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences"
  ON user_preferences FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own preferences"
  ON user_preferences FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================
-- 3. CREATE UPDATE TRIGGER
-- ============================================
-- Create function for updating updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS update_user_preferences_updated_at ON user_preferences;
CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON user_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 4. CREATE STORAGE BUCKETS
-- ============================================
-- Create 'backgrounds' bucket for custom background images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('backgrounds', 'backgrounds', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
ON CONFLICT (id) DO UPDATE
SET 
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Create 'audio' bucket for custom ambient sounds
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('audio', 'audio', true, 10485760, ARRAY['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/webm'])
ON CONFLICT (id) DO UPDATE
SET 
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- ============================================
-- 5. CREATE STORAGE POLICIES FOR BACKGROUNDS
-- ============================================
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can upload their own backgrounds" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own backgrounds" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own backgrounds" ON storage.objects;
DROP POLICY IF EXISTS "Public can view backgrounds" ON storage.objects;

-- Create storage policies for backgrounds bucket
CREATE POLICY "Users can upload their own backgrounds"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'backgrounds' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can update their own backgrounds"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'backgrounds' AND
    (storage.foldername(name))[1] = auth.uid()::text
  )
  WITH CHECK (
    bucket_id = 'backgrounds' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete their own backgrounds"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'backgrounds' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Public can view backgrounds"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'backgrounds');

-- ============================================
-- 6. CREATE STORAGE POLICIES FOR AUDIO
-- ============================================
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can upload their own audio" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own audio" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own audio" ON storage.objects;
DROP POLICY IF EXISTS "Public can view audio" ON storage.objects;

-- Create storage policies for audio bucket
CREATE POLICY "Users can upload their own audio"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'audio' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can update their own audio"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'audio' AND
    (storage.foldername(name))[1] = auth.uid()::text
  )
  WITH CHECK (
    bucket_id = 'audio' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete their own audio"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'audio' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Public can view audio"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'audio');

-- ============================================
-- SUCCESS MESSAGE
-- ============================================
DO $$
BEGIN
  RAISE NOTICE '✅ Migration completed successfully!';
  RAISE NOTICE '✅ user_preferences table created';
  RAISE NOTICE '✅ Storage buckets created';
  RAISE NOTICE '✅ RLS policies applied';
END $$;

