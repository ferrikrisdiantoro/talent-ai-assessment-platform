-- =============================================
-- FIX: RLS Policy for Profiles (Prevent Recursion)
-- =============================================

-- Drop existing policies that might cause issues
DROP POLICY IF EXISTS "Users can view relevant profiles" ON profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON profiles;

-- Simpler policy: Users can always view their own profile
-- Recruiters can view profiles of candidates they invited
-- Admins handled via service role key in server actions
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "Recruiters can view invited candidates"
  ON profiles FOR SELECT
  USING (invited_by = auth.uid());

-- Allow insert own profile
DROP POLICY IF EXISTS "Users can insert their own profile." ON profiles;
CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (id = auth.uid());

-- Allow update own profile  
DROP POLICY IF EXISTS "Users can update own profile." ON profiles;
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (id = auth.uid());
