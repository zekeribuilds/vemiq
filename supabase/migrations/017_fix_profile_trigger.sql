-- Phase 4B.18 - Fix Profile Trigger Schema Mismatch
-- Migration: 017_fix_profile_trigger.sql
-- Purpose: Fix handle_new_user() trigger to match actual profiles table schema
-- Issue: 20240615_create_profiles.sql trigger inserts into columns that don't exist or were removed

-- Drop the broken trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop the broken function
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create corrected handle_new_user() function that matches actual schema
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (
        id,
        full_name,
        avatar_url,
        role,
        created_at,
        updated_at
    )
    VALUES (
        NEW.id,
        COALESCE(
            NEW.raw_user_meta_data->>'full_name',
            NEW.raw_user_meta_data->>'name',
            ''
        ),
        NEW.raw_user_meta_data->>'avatar_url',
        'student',
        NOW(),
        NOW()
    )
    ON CONFLICT (id) DO NOTHING;

    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Log error but don't fail signup
        RAISE WARNING 'Failed to create profile for user %: %', NEW.id, SQLERRM;
        RETURN NEW;
END;
$$;

-- Create trigger on user signup
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();
