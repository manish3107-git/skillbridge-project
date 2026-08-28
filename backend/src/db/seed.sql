-- SkillBridge Demo Seed Data (Rahul - Candidate Demo)

-- Disable RLS on all tables for clean backend database access
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

-- Seed User Candidate (Password is 'password123')
INSERT INTO users (id, email, password_hash, role)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'rahul@skillbridge.demo',
  '$2a$10$wT0X8rP1f5m9wBv8j7x9.O1g2h3i4j5k6l7m8n9o0p1q2r3s4t5u6',
  'candidate'
) ON CONFLICT (email) DO NOTHING;

-- Seed Candidate Profile for Rahul
INSERT INTO candidate_profiles (
  id, user_id, full_name, headline, education, target_role, experience_level, location,
  readiness_score, technical_score, project_score, resume_score, assessment_score, interview_score, communication_score, onboarding_step
)
VALUES (
  '22222222-2222-2222-2222-222222222222',
  '11111111-1111-1111-1111-111111111111',
  'Rahul Sharma',
  'Aspiring Frontend Engineer specializing in React & Modern Web Tech',
  'B.Tech in Computer Science',
  'Junior Frontend Developer',
  'Entry Level (0-1 YOE)',
  'Bangalore, India',
  74, 68, 72, 84, 58, 71, 74, 6
) ON CONFLICT (user_id) DO NOTHING;

-- Seed User Admin (Password is 'password123')
INSERT INTO users (id, email, password_hash, role)
VALUES (
  '99999999-9999-9999-9999-999999999999',
  'admin@techcorp.com',
  '$2a$10$wT0X8rP1f5m9wBv8j7x9.O1g2h3i4j5k6l7m8n9o0p1q2r3s4t5u6',
  'admin'
) ON CONFLICT (email) DO NOTHING;

-- Seed Organization Profile for Admin
INSERT INTO organization_profiles (
  id, user_id, org_name, industry
)
VALUES (
  '88888888-8888-8888-8888-888888888888',
  '99999999-9999-9999-9999-999999999999',
  'TechCorp Talent Accelerators',
  'Software Development & Recruitment'
) ON CONFLICT (user_id) DO NOTHING;
