-- Create training_organizations and organization_departments tables
-- These provide the foundation for placement/training organization data
-- Separate from academic institutions hierarchy

CREATE TABLE training_organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  type TEXT, -- 'company', 'government', 'ngo', etc.
  industry TEXT,
  state TEXT,
  country TEXT DEFAULT 'Nigeria',
  website TEXT,
  logo_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE organization_departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES training_organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(organization_id, name)
);

-- Create indexes
CREATE INDEX idx_organization_departments_organization_id ON organization_departments(organization_id);

-- Enable RLS
ALTER TABLE training_organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_departments ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public can view training organizations" ON training_organizations FOR SELECT USING (true);
CREATE POLICY "Public can view organization departments" ON organization_departments FOR SELECT USING (true);

-- Admin-only insert/update (to be implemented with proper auth)
CREATE POLICY "Admins can manage training organizations" ON training_organizations FOR ALL USING (false);
CREATE POLICY "Admins can manage organization departments" ON organization_departments FOR ALL USING (false);

-- Update timestamp triggers
CREATE TRIGGER update_training_organizations_updated_at BEFORE UPDATE ON training_organizations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_organization_departments_updated_at BEFORE UPDATE ON organization_departments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
