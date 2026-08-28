-- SkillBridge Master PostgreSQL Database Schema
-- Supabase Compatible PostgreSQL Schema

-- 1. Users Table (Core Auth Reference)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('candidate', 'admin', 'recruiter')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Candidate Profiles Table
CREATE TABLE IF NOT EXISTS candidate_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  full_name VARCHAR(255) NOT NULL,
  headline VARCHAR(255),
  education VARCHAR(255),
  target_role VARCHAR(255) DEFAULT 'Junior Frontend Developer',
  experience_level VARCHAR(100),
  location VARCHAR(255),
  readiness_score INT DEFAULT 40 CHECK (readiness_score BETWEEN 0 AND 100),
  technical_score INT DEFAULT 40 CHECK (technical_score BETWEEN 0 AND 100),
  project_score INT DEFAULT 40 CHECK (project_score BETWEEN 0 AND 100),
  resume_score INT DEFAULT 40 CHECK (resume_score BETWEEN 0 AND 100),
  assessment_score INT DEFAULT 40 CHECK (assessment_score BETWEEN 0 AND 100),
  interview_score INT DEFAULT 40 CHECK (interview_score BETWEEN 0 AND 100),
  communication_score INT DEFAULT 40 CHECK (communication_score BETWEEN 0 AND 100),
  onboarding_step INT DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Organization Profiles Table
CREATE TABLE IF NOT EXISTS organization_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  org_name VARCHAR(255) NOT NULL,
  industry VARCHAR(255),
  website VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Skills Master Table
CREATE TABLE IF NOT EXISTS skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL,
  category VARCHAR(100) NOT NULL
);

-- 5. Candidate Skills Table
CREATE TABLE IF NOT EXISTS candidate_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID REFERENCES candidate_profiles(id) ON DELETE CASCADE,
  skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
  self_rating INT CHECK (self_rating BETWEEN 0 AND 100),
  evidence_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Projects Table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID REFERENCES candidate_profiles(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  technologies TEXT[],
  github_url VARCHAR(255),
  demo_url VARCHAR(255),
  contribution_details TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Applications & Rejections Table
CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID REFERENCES candidate_profiles(id) ON DELETE CASCADE,
  company VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL,
  stage VARCHAR(100) NOT NULL,
  result VARCHAR(50) NOT NULL CHECK (result IN ('Pending', 'Accepted', 'Rejected')),
  rejection_stage VARCHAR(100),
  interview_score INT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Resumes Table
CREATE TABLE IF NOT EXISTS resumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID REFERENCES candidate_profiles(id) ON DELETE CASCADE,
  filename VARCHAR(255) NOT NULL,
  parsed_text TEXT,
  strength_score INT CHECK (strength_score BETWEEN 0 AND 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Target Jobs Table
CREATE TABLE IF NOT EXISTS target_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID REFERENCES candidate_profiles(id) ON DELETE CASCADE,
  company VARCHAR(255),
  job_title VARCHAR(255) NOT NULL,
  job_description TEXT NOT NULL,
  match_score INT CHECK (match_score BETWEEN 0 AND 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. Diagnoses Table
CREATE TABLE IF NOT EXISTS diagnoses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID REFERENCES candidate_profiles(id) ON DELETE CASCADE,
  primary_bottleneck VARCHAR(100) NOT NULL,
  secondary_bottleneck VARCHAR(100),
  confidence NUMERIC(3, 2),
  explanation TEXT,
  evidence TEXT[],
  affected_areas TEXT[],
  next_best_action JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. Action Plans Table
CREATE TABLE IF NOT EXISTS action_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID REFERENCES candidate_profiles(id) ON DELETE CASCADE,
  primary_action JSONB NOT NULL,
  secondary_actions JSONB,
  schedule_days JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 12. Mock Interviews Table
CREATE TABLE IF NOT EXISTS mock_interviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID REFERENCES candidate_profiles(id) ON DELETE CASCADE,
  target_role VARCHAR(255),
  interview_type VARCHAR(100),
  difficulty VARCHAR(50),
  overall_score INT,
  technical_correctness INT,
  problem_solving INT,
  communication INT,
  feedback JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 13. Progress Snapshots Table
CREATE TABLE IF NOT EXISTS progress_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID REFERENCES candidate_profiles(id) ON DELETE CASCADE,
  readiness_score INT,
  technical_score INT,
  project_score INT,
  resume_score INT,
  assessment_score INT,
  interview_score INT,
  communication_score INT,
  trigger_event VARCHAR(255),
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Disable Row-Level Security for Backend Client Access
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE candidate_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE organization_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE skills DISABLE ROW LEVEL SECURITY;
ALTER TABLE candidate_skills DISABLE ROW LEVEL SECURITY;
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE applications DISABLE ROW LEVEL SECURITY;
ALTER TABLE resumes DISABLE ROW LEVEL SECURITY;
ALTER TABLE target_jobs DISABLE ROW LEVEL SECURITY;
ALTER TABLE diagnoses DISABLE ROW LEVEL SECURITY;
ALTER TABLE action_plans DISABLE ROW LEVEL SECURITY;
ALTER TABLE mock_interviews DISABLE ROW LEVEL SECURITY;
ALTER TABLE progress_snapshots DISABLE ROW LEVEL SECURITY;

-- Indexes for Query Performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_candidate_profiles_user_id ON candidate_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_candidate_id ON applications(candidate_id);
CREATE INDEX IF NOT EXISTS idx_diagnoses_candidate_id ON diagnoses(candidate_id);
