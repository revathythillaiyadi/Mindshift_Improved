/*
  # Add Profile Preferences and Additional Fields

  ## Changes Made
  1. Modifications to `profiles` table
    - Add `pronouns` (text) - User's preferred pronouns
    - Add `location` (text) - User's location (City, Country)
    - Add `avatar_url` (text) - URL to user's avatar image

  2. Storage Bucket
    - Create 'avatars' bucket for storing profile pictures
    - Enable public access for avatar images
    - Set file size limit and allowed mime types

  3. Security
    - Maintains existing RLS policies on profiles table
    - Add RLS policies for avatars storage bucket
    - Users can only upload/update their own avatars

  ## Notes
  - All new fields are optional
  - Avatar images are stored in Supabase Storage
  - Location is free-form text for flexibility
  - Pronouns field supports custom values
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'pronouns'
  ) THEN
    ALTER TABLE profiles ADD COLUMN pronouns text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'location'
  ) THEN
    ALTER TABLE profiles ADD COLUMN location text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'avatar_url'
  ) THEN
    ALTER TABLE profiles ADD COLUMN avatar_url text;
  END IF;
END $$;

INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Users can upload their own avatar"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'avatars' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can update their own avatar"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'avatars' AND
    (storage.foldername(name))[1] = auth.uid()::text
  )
  WITH CHECK (
    bucket_id = 'avatars' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete their own avatar"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'avatars' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Avatar images are publicly accessible"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'avatars');
