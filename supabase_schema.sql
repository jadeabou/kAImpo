-- ============================================================
-- kAImpo — Supabase Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Users table (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text not null,
  created_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table public.profiles enable row level security;
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Consultations table
create table public.consultations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  created_at timestamp with time zone default now(),
  symptoms text,
  language text default 'en',
  herbs jsonb default '[]',
  foods jsonb default '[]',
  lifestyle jsonb default '[]',
  feedback text default '',
  feedback_detail text default ''
);

alter table public.consultations enable row level security;
create policy "Users can view own consultations" on public.consultations for select using (auth.uid() = user_id);
create policy "Users can insert own consultations" on public.consultations for insert with check (auth.uid() = user_id);
create policy "Users can update own consultations" on public.consultations for update using (auth.uid() = user_id);

-- Index for fast user queries
create index consultations_user_id_idx on public.consultations(user_id);
create index consultations_created_at_idx on public.consultations(created_at desc);
