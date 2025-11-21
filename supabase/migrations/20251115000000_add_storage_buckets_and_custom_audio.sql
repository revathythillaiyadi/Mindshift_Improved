/*
  # Add Storage Buckets and Custom Audio Support

  1. Storage Buckets
    - Create 'backgrounds' bucket for custom background images
    - Create 'audio' bucket for custom ambient sounds
    - Both buckets are public for easy access

  2. Database Changes
    - Add `custom_audio_url` column to user_preferences table

  3. Security
    - Add RLS policies for storage buckets
    - Users can only upload/update/delete their own files
*/

-- Add custom_audio_url column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_preferences' AND column_name = 'custom_audio_url'
  ) THEN
    ALTER TABLE user_preferences ADD COLUMN custom_audio_url text;
  END IF;
END $$;

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('backgrounds', 'backgrounds', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('audio', 'audio', true, 10485760, ARRAY['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/webm'])
ON CONFLICT (id) DO UPDATE
SET 
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Storage policies for backgrounds bucket
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

-- Storage policies for audio bucket
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

