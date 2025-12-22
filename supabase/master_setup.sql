-- MASTER SETUP SCRIPT
-- Run this entire script in the Supabase SQL Editor to set up the database completely.

-- 1. EXTENSIONS
create extension if not exists "uuid-ossp";

-- 2. TABLES
-- Profiles
create table if not exists profiles (
  id uuid references auth.users not null primary key,
  full_name text,
  role text check (role in ('admin', 'candidate')) default 'candidate',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Assessments
create table if not exists assessments (
  id uuid default uuid_generate_v4() primary key,
  code text unique not null,
  title text not null,
  description text,
  type text check (type in ('cognitive', 'personality', 'attitude', 'interest')) not null,
  duration_minutes integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Questions
create table if not exists questions (
  id uuid default uuid_generate_v4() primary key,
  assessment_id uuid references assessments(id) on delete cascade not null,
  text text not null,
  type text check (type in ('multiple_choice', 'likert', 'text')) not null,
  options jsonb,
  category text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Assessment Sessions
create table if not exists assessment_sessions (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users not null,
    status text check (status in ('in_progress', 'completed')) default 'in_progress',
    started_at timestamp with time zone default timezone('utc'::text, now()) not null,
    completed_at timestamp with time zone,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Responses
create table if not exists responses (
  id uuid default uuid_generate_v4() primary key,
  session_id uuid references assessment_sessions(id) on delete cascade, 
  user_id uuid references auth.users not null,
  assessment_id uuid references assessments(id) not null,
  question_id uuid references questions(id) not null,
  answer_value text,
  score_value integer,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, question_id)
);

-- Scores
create table if not exists scores (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  assessment_id uuid references assessments(id),
  dimension text,
  raw_score numeric,
  normalized_score numeric,
  category text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Reports
create table if not exists reports (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  summary text,
  details jsonb,
  pdf_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. ROW LEVEL SECURITY (RLS)
alter table profiles enable row level security;
alter table assessments enable row level security;
alter table questions enable row level security;
alter table assessment_sessions enable row level security;
alter table responses enable row level security;
alter table scores enable row level security;
alter table reports enable row level security;

-- Policies
-- Profiles
create policy "Public view" on profiles for select using (true);
create policy "Self insert" on profiles for insert with check (auth.uid() = id);
create policy "Self update" on profiles for update using (auth.uid() = id);

-- Assessments & Questions (Public Read)
create policy "Public read assessments" on assessments for select using (true);
create policy "Public read questions" on questions for select using (true);
-- Allow authenticated users to insert (for Admin simplicity in MVP, ideally allow only admin role)
create policy "Auth update assessments" on assessments for all using (auth.role() = 'authenticated'); 
create policy "Auth update questions" on questions for all using (auth.role() = 'authenticated');

-- Sessions & Responses (Self Only)
create policy "Self select sessions" on assessment_sessions for select using (auth.uid() = user_id);
create policy "Self insert sessions" on assessment_sessions for insert with check (auth.uid() = user_id);
create policy "Self update sessions" on assessment_sessions for update using (auth.uid() = user_id);

create policy "Self select responses" on responses for select using (auth.uid() = user_id);
create policy "Self insert responses" on responses for insert with check (auth.uid() = user_id);

-- Scores & Reports (Self Only)
create policy "Self select scores" on scores for select using (auth.uid() = user_id);
create policy "Self select reports" on reports for select using (auth.uid() = user_id);

-- 4. TRIGGERS
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, new.raw_user_meta_data->>'full_name', 'candidate')
  on conflict (id) do nothing; -- Prevent error if already exists
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 5. SEED DATA
insert into assessments (code, title, type, description) values
('COG-01', 'Tes Penalaran & Problem Solving Kerja', 'cognitive', 'Mengukur kemampuan logika dan penyelesaian masalah.'),
('ATT-01', 'Tes Ketelitian & Konsistensi Kerja', 'attitude', 'Mengukur ketelitian dan fokus.'),
('PER-01', 'Profil Gaya Kerja Profesional (Big Five)', 'personality', 'Mengukur 5 dimensi kepribadian utama.'),
('PER-02', 'Profil Gaya Interaksi & Komunikasi Kerja (DISC)', 'personality', 'Mengukur gaya komunikasi dominan.'),
('WAI-01', 'Tes Sikap & Tanggung Jawab Kerja', 'attitude', 'Mengukur integritas dan tanggung jawab.'),
('INT-01', 'Tes Minat & Kecocokan Peran Kerja (RIASEC)', 'interest', 'Mengukur minat karir.'),
('RES-01', 'Tes Ketahanan & Daya Juang Kerja (AQ)', 'personality', 'Mengukur adversity quotient.')
on conflict (code) do nothing;

