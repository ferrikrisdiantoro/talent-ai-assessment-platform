-- Add unique constraints needed for upsert operations
-- Run this in Supabase SQL Editor

-- 1. Add unique constraint for scores table (for upsert)
-- This allows updating scores when user retakes an assessment
ALTER TABLE scores 
DROP CONSTRAINT IF EXISTS scores_user_assessment_dimension_key;

ALTER TABLE scores 
ADD CONSTRAINT scores_user_assessment_dimension_key 
UNIQUE (user_id, assessment_id, dimension);

-- 2. Verify constraints exist
SELECT 
    tc.constraint_name, 
    tc.table_name, 
    kcu.column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
    ON tc.constraint_name = kcu.constraint_name
WHERE tc.constraint_type = 'UNIQUE' 
    AND tc.table_name IN ('responses', 'scores');
