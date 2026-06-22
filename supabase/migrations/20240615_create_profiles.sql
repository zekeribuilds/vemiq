-- Create profiles table with proper foreign keys
-- This replaces the auth metadata approach for student identity data
-- Uses foreign keys to institutions/faculties/departments to avoid duplication

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Foreign keys to institution hierarchy
  institution_id UUID REFERENCES institutions(id) ON DELETE SET NULL,
  faculty_id UUID REFERENCES faculties(id) ON DELETE SET NULL,
  department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
  
  -- Training organization (separate from academic institution)
  training_organization_id UUID REFERENCES training_organizations(id) ON DELETE SET NULL,
  training_department_id UUID REFERENCES organization_departments(id) ON DELETE SET NULL,
  
  -- Program information
  program TEXT DEFAULT 'SIWES', -- 'SIWES' or 'SWEP'
  academic_session TEXT,
  
  -- Personal information
  full_name TEXT,
  phone TEXT,
  profile_image_url TEXT,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes
CREATE INDEX idx_profiles_institution_id ON profiles(institution_id);
CREATE INDEX idx_profiles_faculty_id ON profiles(faculty_id);
CREATE INDEX idx_profiles_department_id ON profiles(department_id);
CREATE INDEX idx_profiles_training_organization_id ON profiles(training_organization_id);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Create trigger for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create profile on user signup from auth metadata
-- Note: This function handles the case where training_organizations table might not exist yet
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    full_name,
    institution_id,
    faculty_id,
    department_id,
    program,
    academic_session,
    training_organization_id
  )
  SELECT
    NEW.id,
    NEW.raw_user_metadata->>'full_name',
    -- Try to match institution by name from metadata
    (SELECT id FROM institutions WHERE name ILIKE (NEW.raw_user_metadata->>'institution') LIMIT 1),
    -- Try to match faculty by name from metadata
    (SELECT id FROM faculties WHERE name ILIKE (NEW.raw_user_metadata->>'faculty') LIMIT 1),
    -- Try to match department by name from metadata
    (SELECT id FROM departments WHERE name ILIKE (NEW.raw_user_metadata->>'department') LIMIT 1),
    NEW.raw_user_metadata->>'program',
    NEW.raw_user_metadata->>'academic_session',
    -- Try to match training organization by name from metadata (if table exists)
    (SELECT id FROM training_organizations WHERE name ILIKE (NEW.raw_user_metadata->>'organization') LIMIT 1);
  
  RETURN NEW;
EXCEPTION
  WHEN undefined_table THEN
    -- If training_organizations table doesn't exist yet, insert without it
    INSERT INTO public.profiles (
      id,
      full_name,
      institution_id,
      faculty_id,
      department_id,
      program,
      academic_session
    )
    SELECT
      NEW.id,
      NEW.raw_user_metadata->>'full_name',
      (SELECT id FROM institutions WHERE name ILIKE (NEW.raw_user_metadata->>'institution') LIMIT 1),
      (SELECT id FROM faculties WHERE name ILIKE (NEW.raw_user_metadata->>'faculty') LIMIT 1),
      (SELECT id FROM departments WHERE name ILIKE (NEW.raw_user_metadata->>'department') LIMIT 1),
      NEW.raw_user_metadata->>'program',
      NEW.raw_user_metadata->>'academic_session';
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
