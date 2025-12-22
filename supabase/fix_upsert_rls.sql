-- Fix RLS policies for upsert operations
-- Run this in Supabase SQL Editor

-- 1. Add UPDATE policy for responses table (needed for upsert)
CREATE POLICY "Users can update their own responses" 
ON responses 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 2. Add UPDATE policy for scores table (needed for upsert)
CREATE POLICY "Users can update their own scores" 
ON scores 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 3. Verify all policies
SELECT 
    schemaname,
    tablename,
    policyname,
    cmd
FROM pg_policies 
WHERE tablename IN ('responses', 'scores')
ORDER BY tablename, cmd;
