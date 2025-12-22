-- FIX: Add missing INSERT policy for scores table
-- Run this in Supabase SQL Editor to fix the "Error saving scores" issue

-- Add policy for users to insert their own scores
CREATE POLICY "Users can insert their own scores" 
ON scores 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Also add INSERT policy for reports (for future PDF generation)
CREATE POLICY "Users can insert their own reports" 
ON reports 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Verify policies exist now
SELECT 
    schemaname, 
    tablename, 
    policyname, 
    cmd 
FROM pg_policies 
WHERE tablename IN ('scores', 'reports');
