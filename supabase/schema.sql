-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES
create table profiles (
  id uuid references auth.users not null primary key,
  full_name text,
  role text check (role in ('admin', 'candidate')) default 'candidate',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for profiles
alter table profiles enable row level security;
create policy "Public profiles are viewable by everyone." on profiles for select using (true);
create policy "Users can insert their own profile." on profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile." on profiles for update using (auth.uid() = id);

-- ASSESSMENTS (Modules)
create table assessments (
  id uuid default uuid_generate_v4() primary key,
  code text unique not null, -- e.g., COG-01, ATT-01
  title text not null,
  description text,
  type text check (type in ('cognitive', 'personality', 'attitude', 'interest')) not null,
  duration_minutes integer default 0, -- 0 for untimed
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- QUESTIONS
create table questions (
  id uuid default uuid_generate_v4() primary key,
  assessment_id uuid references assessments(id) on delete cascade not null,
  text text not null,
  type text check (type in ('multiple_choice', 'likert', 'text')) not null,
  options jsonb, -- Array of options for MCQ/Likert: [{"label": "A", "value": 1, "text": "..."}]
  category text, -- For dimensions (e.g., Openness, Conscientiousness)
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ASSESSMENT SESSIONS (Tracking progress)
create table assessment_sessions (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users not null,
    status text check (status in ('in_progress', 'completed')) default 'in_progress',
    started_at timestamp with time zone default timezone('utc'::text, now()) not null,
    completed_at timestamp with time zone,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RESPONSES
create table responses (
  id uuid default uuid_generate_v4() primary key,
  session_id uuid references assessment_sessions(id) on delete cascade, 
  user_id uuid references auth.users not null,
  assessment_id uuid references assessments(id) not null,
  question_id uuid references questions(id) not null,
  answer_value text, -- JSON string or raw value
  score_value integer, -- Pre-calculated score for this single answer if applicable
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, question_id) -- Prevent duplicate answers
);

-- SCORES (Aggregated results per module/dimension)
create table scores (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  assessment_id uuid references assessments(id),
  dimension text, -- Specific dimension e.g. "Neuroticism" or "Total"
  raw_score numeric,
  normalized_score numeric, -- 0-100
  category text, -- Low, Medium, High
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- REPORTS
create table reports (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  summary text, -- AI Generated summary
  details jsonb, -- Full analysis grid
  pdf_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Initial Data Seeding (Modules)
insert into assessments (code, title, type, description) values
('COG-01', 'Tes Penalaran & Problem Solving Kerja', 'cognitive', 'Mengukur kemampuan logika dan penyelesaian masalah.'),
('ATT-01', 'Tes Ketelitian & Konsistensi Kerja', 'attitude', 'Mengukur ketelitian dan fokus.'),
('PER-01', 'Profil Gaya Kerja Profesional (Big Five)', 'personality', 'Mengukur 5 dimensi kepribadian utama.'),
('PER-02', 'Profil Gaya Interaksi & Komunikasi Kerja (DISC)', 'personality', 'Mengukur gaya komunikasi dominan.'),
('WAI-01', 'Tes Sikap & Tanggung Jawab Kerja', 'attitude', 'Mengukur integritas dan tanggung jawab.'),
('INT-01', 'Tes Minat & Kecocokan Peran Kerja (RIASEC)', 'interest', 'Mengukur minat karir.'),
('RES-01', 'Tes Ketahanan & Daya Juang Kerja (AQ)', 'personality', 'Mengukur adversity quotient.');
