-- Coding for Green Life — Phase 1 schema
-- Run this in the Supabase SQL editor for your project.

create table if not exists students (
  id uuid primary key,
  student_code text not null,
  name text not null,
  class_name text not null,
  avatar text not null,
  xp integer not null default 0,
  level integer not null default 1,
  green_energy integer not null default 0,
  badges jsonb not null default '[]',
  missions jsonb not null default '{}',
  pre_test jsonb,
  post_test jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Safe to re-run: adds the pre/post-test columns to a students table that
-- already existed before this phase.
alter table students add column if not exists pre_test jsonb;
alter table students add column if not exists post_test jsonb;

create table if not exists mission_attempts (
  id bigint generated always as identity primary key,
  student_id uuid not null references students(id) on delete cascade,
  mission_id text not null,
  attempt_number integer not null,
  score integer not null,
  max_score integer not null,
  correct_count integer not null,
  wrong_count integer not null,
  error_types text[] not null default '{}',
  time_seconds integer not null,
  completed_at timestamptz not null default now()
);

create table if not exists reflections (
  id bigint generated always as identity primary key,
  student_id uuid not null references students(id) on delete cascade,
  mission_id text not null,
  learned text,
  problem text,
  solution text,
  mistake text,
  improve text,
  real_life_use text,
  created_at timestamptz not null default now()
);

create index if not exists idx_attempts_student on mission_attempts(student_id);
create index if not exists idx_attempts_mission on mission_attempts(mission_id);
create index if not exists idx_reflections_student on reflections(student_id);

-- Row Level Security: enable and add permissive policies for now.
-- Tighten these (e.g. scope by auth.uid() / teacher role) before real classroom rollout.
alter table students enable row level security;
alter table mission_attempts enable row level security;
alter table reflections enable row level security;

drop policy if exists "allow all students" on students;
create policy "allow all students" on students for all using (true) with check (true);
drop policy if exists "allow all attempts" on mission_attempts;
create policy "allow all attempts" on mission_attempts for all using (true) with check (true);
drop policy if exists "allow all reflections" on reflections;
create policy "allow all reflections" on reflections for all using (true) with check (true);

-- ============================================================
-- Phase: Creator Studio, Peer Feedback, Rubric
-- Safe to re-run: uses "if not exists" throughout.
-- ============================================================

create table if not exists projects (
  id uuid primary key,
  student_id uuid not null references students(id) on delete cascade,
  project_type text not null, -- game | animation | interactive_story | green_campaign | digital_solution
  title text not null,
  problem text,
  goal text,
  algorithm text,
  flowchart text,
  code_notes text,
  test_notes text,
  debug_notes text,
  improve_notes text,
  reflection text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists peer_feedback (
  id bigint generated always as identity primary key,
  project_id uuid not null references projects(id) on delete cascade,
  reviewer_student_id uuid not null references students(id) on delete cascade,
  clarity_score int not null check (clarity_score between 1 and 5),
  fun_score int not null check (fun_score between 1 and 5),
  correctness_score int not null check (correctness_score between 1 and 5),
  creativity_score int not null check (creativity_score between 1 and 5),
  problem_solving_score int not null check (problem_solving_score between 1 and 5),
  env_benefit_score int not null check (env_benefit_score between 1 and 5),
  comment text,
  created_at timestamptz not null default now()
);

create table if not exists rubric_scores (
  id bigint generated always as identity primary key,
  student_id uuid not null references students(id) on delete cascade,
  criterion text not null, -- computational_thinking | algorithm | coding | debugging | creativity | problem_solving | responsibility | environmental_awareness
  level int not null check (level between 1 and 4),
  note text,
  scored_by text,
  updated_at timestamptz not null default now(),
  unique (student_id, criterion)
);

create index if not exists idx_projects_student on projects(student_id);
create index if not exists idx_peer_feedback_project on peer_feedback(project_id);
create index if not exists idx_rubric_student on rubric_scores(student_id);

alter table projects enable row level security;
alter table peer_feedback enable row level security;
alter table rubric_scores enable row level security;

drop policy if exists "allow all projects" on projects;
create policy "allow all projects" on projects for all using (true) with check (true);
drop policy if exists "allow all peer_feedback" on peer_feedback;
create policy "allow all peer_feedback" on peer_feedback for all using (true) with check (true);
drop policy if exists "allow all rubric_scores" on rubric_scores;
create policy "allow all rubric_scores" on rubric_scores for all using (true) with check (true);
