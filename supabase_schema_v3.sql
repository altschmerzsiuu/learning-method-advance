-- =====================
-- PROFILES
-- =====================
create table if not exists profiles (
  id uuid primary key references auth.users(id),
  nama text not null,
  kelas text check (kelas in ('VII','VIII','IX')),
  sekolah text,
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =====================
-- USER STREAK & XP
-- =====================
create table if not exists user_streak (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) unique,
  streak_count int default 0,
  last_active date,
  total_xp int default 0,
  updated_at timestamptz default now()
);

-- =====================
-- USER PROGRESS (per topik)
-- =====================
create table if not exists user_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  topik_id text not null,
  status text check (status in ('locked','active','done')) default 'locked',
  xp_earned int default 0,
  completed_at timestamptz,
  created_at timestamptz default now(),
  unique(user_id, topik_id)
);

-- =====================
-- QUIZ QUESTIONS
-- =====================
alter table quiz_questions
  add column if not exists pool text check (pool in ('materi','latihan','both')) default 'both',
  add column if not exists tingkat text check (tingkat in ('mudah','sedang','susah')) default 'sedang';

-- =====================
-- QUIZ RESULTS
-- =====================
create table if not exists quiz_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  topik_id text,
  tipe text check (tipe in ('materi','latihan')),
  score int,
  total_soal int,
  xp_earned int,
  created_at timestamptz default now()
);

-- =====================
-- GAME HISTORY
-- =====================
create table if not exists game_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  mode text check (mode in ('solo','team')),
  difficulty text check (difficulty in ('mudah','susah')),
  result text check (result in ('menang','kalah','seri')),
  xp_earned int default 0,
  soal_benar int default 0,
  soal_total int default 0,
  created_at timestamptz default now()
);

-- =====================
-- BADGES
-- =====================
create table if not exists badges (
  id text primary key,
  nama text not null,
  deskripsi text,
  icon text,
  kondisi jsonb
);

create table if not exists user_badges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  badge_id text references badges(id),
  earned_at timestamptz default now(),
  unique(user_id, badge_id)
);

-- SEED DATA BADGES
insert into badges (id, nama, deskripsi, icon, kondisi) values
  ('first_login',    'Selamat Datang!',     'Login pertama kali',                    '👋', '{"type":"login","value":1}'),
  ('first_quiz',     'Quiz Perdana',        'Selesaikan quiz pertama',               '📝', '{"type":"quiz_done","value":1}'),
  ('perfect_score',  'Nilai Sempurna',      'Dapat nilai 100 di quiz manapun',       '💯', '{"type":"score","value":100}'),
  ('streak_3',       'On Fire!',            'Streak 3 hari berturut-turut',          '🔥', '{"type":"streak","value":3}'),
  ('streak_7',       'Seminggu Penuh',      'Streak 7 hari berturut-turut',          '⚡', '{"type":"streak","value":7}'),
  ('xp_100',         'XP Hunter',           'Kumpulkan 100 XP',                      '🌟', '{"type":"xp","value":100}'),
  ('xp_500',         'XP Master',           'Kumpulkan 500 XP',                      '🏆', '{"type":"xp","value":500}'),
  ('game_win',       'Pemenang Pertama',    'Menang game Think-Tac-Toe pertama kali','🎮', '{"type":"game_win","value":1}'),
  ('all_materi',     'Tamat!',              'Selesaikan semua 6 topik materi',       '🎓', '{"type":"topics_done","value":6}'),
  ('quiz_10',        'Rajin Berlatih',      'Selesaikan 10 sesi quiz/latihan',       '📚', '{"type":"quiz_done","value":10}')
ON CONFLICT (id) DO NOTHING;

-- RLS POLICIES (Allow users to read/write their own data)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_streak ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid "already exists" errors
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own streak" ON public.user_streak;
DROP POLICY IF EXISTS "Users can update their own streak" ON public.user_streak;
DROP POLICY IF EXISTS "Users can insert their own streak" ON public.user_streak;
DROP POLICY IF EXISTS "Users can view their own progress" ON public.user_progress;
DROP POLICY IF EXISTS "Users can update their own progress" ON public.user_progress;
DROP POLICY IF EXISTS "Users can insert their own progress" ON public.user_progress;
DROP POLICY IF EXISTS "Users can view their own quiz results" ON public.quiz_results;
DROP POLICY IF EXISTS "Users can insert their own quiz results" ON public.quiz_results;
DROP POLICY IF EXISTS "Allow public read on badges" ON public.badges;
DROP POLICY IF EXISTS "Users can view their own badges" ON public.user_badges;
DROP POLICY IF EXISTS "Users can insert their own badges" ON public.user_badges;

-- Re-create policies
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);


CREATE POLICY "Users can view their own streak" ON public.user_streak FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own streak" ON public.user_streak FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own streak" ON public.user_streak FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own progress" ON public.user_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own progress" ON public.user_progress FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own progress" ON public.user_progress FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own quiz results" ON public.quiz_results FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own quiz results" ON public.quiz_results FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow public read on badges" ON public.badges FOR SELECT USING (true);

CREATE POLICY "Users can view their own badges" ON public.user_badges FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own badges" ON public.user_badges FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =====================
-- DATABASE TRIGGERS
-- =====================
-- Handle automatic profile and progress creation on user sign up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- 1. Insert profile
  INSERT INTO public.profiles (id, nama, kelas, sekolah)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nama', 'Siswa'),
    COALESCE(NEW.raw_user_meta_data->>'kelas', 'VII'),
    COALESCE(NEW.raw_user_meta_data->>'sekolah', '')
  );

  -- 2. Insert streak
  INSERT INTO public.user_streak (user_id, streak_count, total_xp)
  VALUES (NEW.id, 0, 0);

  -- 3. Insert progress for all topics
  INSERT INTO public.user_progress (user_id, topik_id, status) VALUES (NEW.id, 'tesis', 'active');
  INSERT INTO public.user_progress (user_id, topik_id, status) VALUES (NEW.id, 'argumentasi', 'locked');
  INSERT INTO public.user_progress (user_id, topik_id, status) VALUES (NEW.id, 'penegasan', 'locked');
  INSERT INTO public.user_progress (user_id, topik_id, status) VALUES (NEW.id, 'kaidah', 'locked');
  INSERT INTO public.user_progress (user_id, topik_id, status) VALUES (NEW.id, 'langkah', 'locked');
  INSERT INTO public.user_progress (user_id, topik_id, status) VALUES (NEW.id, 'contoh', 'locked');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
