-- ============================================
-- FIX RLS POLICIES FOR ALL TABLES
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. ASSESSMENT_SESSIONS - Enable RLS and create policies
ALTER TABLE assessment_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own sessions" 
ON assessment_sessions FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own sessions" 
ON assessment_sessions FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sessions" 
ON assessment_sessions FOR UPDATE 
USING (auth.uid() = user_id);

-- 2. RESPONSES - Enable RLS and create policies
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own responses" 
ON responses FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own responses" 
ON responses FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own responses" 
ON responses FOR UPDATE 
USING (auth.uid() = user_id);

-- 3. SCORES - Enable RLS and create policies
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own scores" 
ON scores FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own scores" 
ON scores FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own scores" 
ON scores FOR UPDATE 
USING (auth.uid() = user_id);

-- 4. REPORTS - Enable RLS and create policies
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own reports" 
ON reports FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own reports" 
ON reports FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reports" 
ON reports FOR UPDATE 
USING (auth.uid() = user_id);

-- 5. Add unique constraint for scores if not exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'scores_user_assessment_dimension_key'
    ) THEN
        ALTER TABLE scores ADD CONSTRAINT scores_user_assessment_dimension_key 
        UNIQUE (user_id, assessment_id, dimension);
    END IF;
END $$;

-- 6. ASSESSMENTS - Public read access
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Assessments are viewable by everyone" 
ON assessments FOR SELECT 
USING (true);

CREATE POLICY "Only admins can manage assessments" 
ON assessments FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role = 'admin'
    )
);

-- 7. QUESTIONS - Public read access
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Questions are viewable by everyone" 
ON questions FOR SELECT 
USING (true);

CREATE POLICY "Only admins can manage questions" 
ON questions FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role = 'admin'
    )
);

-- Verify RLS status
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
