-- SQL SCRIPT FOR SUPABASE INITIALIZATION
-- Run this in your Supabase SQL Editor

-- 1. PROFILES TABLE (Stores XP, Level, and Streak)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  total_xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  streak INTEGER DEFAULT 0,
  last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 2. PROGRESS TABLE (Tracks completed topics)
CREATE TABLE IF NOT EXISTS public.progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  topik_id TEXT NOT NULL,
  status TEXT DEFAULT 'done',
  xp_earned INTEGER DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, topik_id)
);

ALTER TABLE public.progress ENABLE ROW LEVEL SECURITY;

-- 3. GAME_HISTORY TABLE (Tracks Tic-Tac-Toe matches)
CREATE TABLE IF NOT EXISTS public.game_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  difficulty TEXT,
  result TEXT, -- 'menang', 'kalah', 'seri'
  xp_earned INTEGER DEFAULT 0,
  played_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.game_history ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES (Allow users to read/write their own data)
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view their own progress" ON public.progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own progress" ON public.progress FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own game history" ON public.game_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own game history" ON public.game_history FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 4. QUIZ SYSTEM (Support for Soal Cerita)
CREATE TABLE IF NOT EXISTS public.quiz_contexts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.quiz_questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  context_id UUID REFERENCES public.quiz_contexts(id) ON DELETE CASCADE,
  topik_id TEXT,
  question_text TEXT NOT NULL,
  options JSONB NOT NULL, -- Array of strings
  correct_answer TEXT NOT NULL, -- The text of the correct option
  explanation TEXT,
  difficulty TEXT CHECK (difficulty IN ('mudah', 'sedang', 'susah')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.quiz_contexts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on quiz_contexts" ON public.quiz_contexts FOR SELECT USING (true);
CREATE POLICY "Allow public read on quiz_questions" ON public.quiz_questions FOR SELECT USING (true);

-- TRIGGER for new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- Add mode to game_history
ALTER TABLE public.game_history ADD COLUMN IF NOT EXISTS mode text check (mode in ('solo', 'team')) default 'solo';
