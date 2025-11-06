/*
  # Add Emergency Contact Relationship Field

  ## Overview
  Adds a field to store the relationship between the user and their emergency contact
  (e.g., Parent, Spouse, Sibling, Friend, etc.)

  ## Changes

  ### Add Column
  - Add `emergency_contact_relationship` column to `profiles` table
  - Type: text
  - Nullable: YES (optional field for existing users)
  - Default: NULL

  ## Notes
  - Existing users will have NULL for this field until they update their profile
  - New users can specify relationship during signup
  - Common values: Parent, Spouse, Partner, Sibling, Friend, Guardian, Other
*/

-- Add emergency contact relationship column
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS emergency_contact_relationship text;