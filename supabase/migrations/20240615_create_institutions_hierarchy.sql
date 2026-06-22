-- Create institutions, faculties, and departments tables
-- These provide the foundation for proper foreign key relationships in profiles
-- Avoids duplication of institution names and enables proper data management

CREATE TABLE institutions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  code TEXT UNIQUE,
  type TEXT, -- 'university', 'polytechnic', 'college', etc.
  state TEXT,
  country TEXT DEFAULT 'Nigeria',
  website TEXT,
  logo_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE faculties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(institution_id, name)
);

CREATE TABLE departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  faculty_id UUID REFERENCES faculties(id) ON DELETE CASCADE,
  institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(institution_id, name)
);

-- Create indexes
CREATE INDEX idx_faculties_institution_id ON faculties(institution_id);
CREATE INDEX idx_departments_institution_id ON departments(institution_id);
CREATE INDEX idx_departments_faculty_id ON departments(faculty_id);

-- Enable RLS
ALTER TABLE institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE faculties ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;

-- Public read access for institutions/faculties/departments
CREATE POLICY "Public can view institutions" ON institutions FOR SELECT USING (true);
CREATE POLICY "Public can view faculties" ON faculties FOR SELECT USING (true);
CREATE POLICY "Public can view departments" ON departments FOR SELECT USING (true);

-- Admin-only insert/update (to be implemented with proper auth)
CREATE POLICY "Admins can manage institutions" ON institutions FOR ALL USING (false);
CREATE POLICY "Admins can manage faculties" ON faculties FOR ALL USING (false);
CREATE POLICY "Admins can manage departments" ON departments FOR ALL USING (false);

-- Update timestamp triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_institutions_updated_at BEFORE UPDATE ON institutions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_faculties_updated_at BEFORE UPDATE ON faculties
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON departments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
