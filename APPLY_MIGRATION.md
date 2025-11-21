# How to Apply Database Migration to Supabase

The migration file `20251115010000_create_core_schema_tables.sql` needs to be applied to your Supabase database.

## Option 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Navigate to **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy the entire contents of `supabase/migrations/20251115010000_create_core_schema_tables.sql`
6. Paste it into the SQL editor
7. Click **Run** (or press Cmd/Ctrl + Enter)
8. Verify the tables were created by checking the **Table Editor** section

## Option 2: Using Supabase CLI (If Installed)

If you have Supabase CLI installed and linked to your project:

```bash
# Make sure you're in the project directory
cd /Users/trevathy/Documents/Mindshift-Nira/Mindshift_NIRA

# Link to your project (if not already linked)
supabase link --project-ref YOUR_PROJECT_REF

# Push migrations
supabase db push
```

## Verify Tables Were Created

After running the migration, verify these tables exist in your Supabase dashboard:

1. **journal_entries** - Should have columns: id, user_id, title, content, tags, created_at, updated_at
2. **chat_history** - Should have columns: id, user_id, timestamp, speaker, message
3. **user_stats** - Should have columns: id, user_id, current_streak, longest_streak, last_journal_date, journal_count_monthly, created_at, updated_at
4. **achievements** - Should have columns: id, user_id, achievement_name, unlocked_at

## Also Apply Storage Buckets Migration

Don't forget to also apply the storage buckets migration:
- File: `supabase/migrations/20251115000000_add_storage_buckets_and_custom_audio.sql`

This creates the `backgrounds` and `audio` storage buckets for custom uploads.

