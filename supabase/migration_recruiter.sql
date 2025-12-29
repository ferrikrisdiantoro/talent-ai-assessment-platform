-- =============================================
-- MIGRATION: Add Recruiter/Business Owner Flow
-- =============================================

-- 1. Update profiles role constraint to include 'recruiter'
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check 
  CHECK (role IN ('admin', 'candidate', 'recruiter'));

-- 2. Create organizations table (perusahaan/bisnis milik recruiter)
CREATE TABLE IF NOT EXISTS organizations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  recruiter_id UUID REFERENCES auth.users NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for organizations
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

-- Policies for organizations
CREATE POLICY "Recruiters can view their own organization"
  ON organizations FOR SELECT
  USING (recruiter_id = auth.uid() OR EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Recruiters can insert their own organization"
  ON organizations FOR INSERT
  WITH CHECK (recruiter_id = auth.uid());

CREATE POLICY "Recruiters can update their own organization"
  ON organizations FOR UPDATE
  USING (recruiter_id = auth.uid());

-- 3. Create invitations table
CREATE TABLE IF NOT EXISTS invitations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  recruiter_id UUID REFERENCES auth.users NOT NULL,
  email TEXT NOT NULL,
  candidate_name TEXT,
  token TEXT UNIQUE NOT NULL,
  status TEXT CHECK (status IN ('pending', 'accepted', 'expired')) DEFAULT 'pending',
  expires_at TIMESTAMPTZ NOT NULL,
  accepted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for invitations
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;

-- Policies for invitations
CREATE POLICY "Recruiters can view their own invitations"
  ON invitations FOR SELECT
  USING (recruiter_id = auth.uid() OR EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Recruiters can insert invitations"
  ON invitations FOR INSERT
  WITH CHECK (recruiter_id = auth.uid());

CREATE POLICY "Recruiters can update their own invitations"
  ON invitations FOR UPDATE
  USING (recruiter_id = auth.uid());

-- Public can view invitation by token (for acceptance)
CREATE POLICY "Anyone can view invitation by token"
  ON invitations FOR SELECT
  USING (true);

-- 4. Add columns to profiles for linking candidates to recruiters
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS invited_by UUID REFERENCES auth.users;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS invitation_id UUID REFERENCES invitations(id);

-- 5. Update profiles RLS to allow recruiters to see their candidates
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON profiles;

CREATE POLICY "Users can view relevant profiles"
  ON profiles FOR SELECT
  USING (
    id = auth.uid() OR  -- Own profile
    invited_by = auth.uid() OR  -- Candidates I invited
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')  -- Admin sees all
  );

-- 6. Update scores RLS to allow recruiters to see their candidates' scores
CREATE POLICY "Recruiters can view their candidates scores"
  ON scores FOR SELECT
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = scores.user_id 
      AND profiles.invited_by = auth.uid()
    ) OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 7. Update reports RLS to allow recruiters to see their candidates' reports
CREATE POLICY "Recruiters can view their candidates reports"
  ON reports FOR SELECT
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = reports.user_id 
      AND profiles.invited_by = auth.uid()
    ) OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 8. Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_profiles_invited_by ON profiles(invited_by);
CREATE INDEX IF NOT EXISTS idx_profiles_organization_id ON profiles(organization_id);
CREATE INDEX IF NOT EXISTS idx_invitations_token ON invitations(token);
CREATE INDEX IF NOT EXISTS idx_invitations_recruiter_id ON invitations(recruiter_id);
CREATE INDEX IF NOT EXISTS idx_invitations_status ON invitations(status);
