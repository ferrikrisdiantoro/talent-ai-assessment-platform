-- Enable RLS on all tables and add policies

-- ASSESSMENTS
alter table assessments enable row level security;
create policy "Assessments are viewable by everyone" on assessments for select using (true);
-- Only admins can insert/update/delete (assuming admin check logic or just restricting to service role for now)
-- For MVP, we'll leave write policies for admins later or rely on service_role for admin dashboard.

-- QUESTIONS
alter table questions enable row level security;
create policy "Questions are viewable by everyone" on questions for select using (true);

-- ASSESSMENT_SESSIONS
alter table assessment_sessions enable row level security;
create policy "Users can view their own sessions" on assessment_sessions for select using (auth.uid() = user_id);
create policy "Users can create their own sessions" on assessment_sessions for insert with check (auth.uid() = user_id);
create policy "Users can update their own sessions" on assessment_sessions for update using (auth.uid() = user_id);

-- RESPONSES
alter table responses enable row level security;
create policy "Users can view their own responses" on responses for select using (auth.uid() = user_id);
create policy "Users can insert their own responses" on responses for insert with check (auth.uid() = user_id);

-- SCORES
alter table scores enable row level security;
create policy "Users can view their own scores" on scores for select using (auth.uid() = user_id);

-- REPORTS
alter table reports enable row level security;
create policy "Users can view their own reports" on reports for select using (auth.uid() = user_id);

-- Explicitly Grant Permissions to authenticated and anon roles (sometimes needed if defaults were strict)
grant usage on schema public to postgres, anon, authenticated, service_role;
grant all privileges on all tables in schema public to postgres, anon, authenticated, service_role;
grant all privileges on all sequences in schema public to postgres, anon, authenticated, service_role;
grant all privileges on all functions in schema public to postgres, anon, authenticated, service_role;
