/*
  # Add User Profile Fields for Sign Up

  ## Changes Made
  1. Modifications to `profiles` table
    - Add `full_name` (text)
    - Add `phone_number` (text)
    - Add `region` (text)
    - Add `emergency_contact_name` (text)
    - Add `emergency_contact_phone` (text)

  2. Security
    - Maintains existing RLS policies
    - All new fields are protected by existing policies

  ## Notes
  - Emergency contact information is stored securely
  - Only accessible by the authenticated user
  - Used exclusively for SOS/crisis situations
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'full_name'
  ) THEN
    ALTER TABLE profiles ADD COLUMN full_name text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'phone_number'
  ) THEN
    ALTER TABLE profiles ADD COLUMN phone_number text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'region'
  ) THEN
    ALTER TABLE profiles ADD COLUMN region text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'emergency_contact_name'
  ) THEN
    ALTER TABLE profiles ADD COLUMN emergency_contact_name text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'emergency_contact_phone'
  ) THEN
    ALTER TABLE profiles ADD COLUMN emergency_contact_phone text;
  END IF;
END $$;
