-- PrepForge Relational Schema
-- Enables cryptographic functions for UUIDs
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Users table (Supports local secure bcrypt auth and OAuth providers)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    avatar_url TEXT,
    provider VARCHAR(50) DEFAULT 'local',
    email_verified BOOLEAN DEFAULT FALSE,
    verification_token TEXT,
    reset_token TEXT,
    reset_token_expires TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Profiles (User details, target role, education, focus areas)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(255),
    headline VARCHAR(255),
    target_role VARCHAR(100) DEFAULT 'Software Engineer',
    target_companies TEXT[] DEFAULT ARRAY['Google', 'Microsoft', 'Amazon'],
    education_level VARCHAR(100) DEFAULT 'Undergraduate',
    experience_level VARCHAR(50) DEFAULT 'Intermediate',
    target_date DATE,
    daily_study_hours INT DEFAULT 3,
    preferred_days TEXT[] DEFAULT ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    focus_areas TEXT[] DEFAULT ARRAY['DSA', 'Development', 'Core CS Subjects'],
    preferred_language VARCHAR(50) DEFAULT 'Python',
    onboarding_completed BOOLEAN DEFAULT FALSE,
    bio TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. User Preferences (Settings, Theme, Notifications)
CREATE TABLE IF NOT EXISTS user_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    theme VARCHAR(20) DEFAULT 'dark',
    email_notifications BOOLEAN DEFAULT TRUE,
    task_reminders BOOLEAN DEFAULT TRUE,
    streak_alerts BOOLEAN DEFAULT TRUE,
    weekly_digest BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Preparation Plans (Personalized schedules generated from onboarding)
CREATE TABLE IF NOT EXISTS preparation_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    target_role VARCHAR(100),
    target_date DATE,
    total_days INT DEFAULT 30,
    status VARCHAR(50) DEFAULT 'active', -- active, paused, completed
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Tasks (Actionable daily study items)
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plan_id UUID REFERENCES preparation_plans(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL, -- dsa, development, core_cs, sql, system_design, custom
    priority VARCHAR(20) DEFAULT 'medium', -- low, medium, high, urgent
    estimated_minutes INT DEFAULT 45,
    due_date DATE NOT NULL,
    repeat_days TEXT[],
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMPTZ,
    related_question_id VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Task Completions (Immutable history of completions)
CREATE TABLE IF NOT EXISTS task_completions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    completion_date DATE NOT NULL,
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    actual_minutes INT DEFAULT 45,
    notes TEXT,
    CONSTRAINT unique_task_completion_date UNIQUE (task_id, completion_date)
);

-- 7. Study Sessions (Logged study time)
CREATE TABLE IF NOT EXISTS study_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    topic VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    duration_minutes INT NOT NULL,
    session_date DATE NOT NULL DEFAULT CURRENT_DATE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Question Bank (Canonical questions across DSA, Dev, CS, SQL, System Design)
CREATE TABLE IF NOT EXISTS questions (
    id VARCHAR(100) PRIMARY KEY,
    type VARCHAR(50) NOT NULL, -- dsa, development, core_cs, sql, system_design
    category VARCHAR(100) NOT NULL,
    pattern_or_topic VARCHAR(100),
    title VARCHAR(255) NOT NULL,
    difficulty VARCHAR(20) NOT NULL, -- Easy, Medium, Hard
    platform VARCHAR(50),
    external_url TEXT,
    explanation TEXT,
    code_example TEXT,
    sample_schema TEXT,
    solution_query TEXT,
    tags TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. User Question Progress (Personal solving & learning status)
CREATE TABLE IF NOT EXISTS user_question_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    question_id VARCHAR(100) NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL DEFAULT 'not_started', -- not_started, attempted, solved, learning, mastered, revising
    solved_at TIMESTAMPTZ,
    personal_notes TEXT,
    confidence_level INT DEFAULT 3,
    attempts_count INT DEFAULT 0,
    last_attempt_code TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_user_question UNIQUE (user_id, question_id)
);

-- 10. Bookmarks (User question bookmarks)
CREATE TABLE IF NOT EXISTS bookmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    question_id VARCHAR(100) NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_user_bookmark UNIQUE (user_id, question_id)
);

-- 11. Revision Schedules (Spaced repetition & revision calendar items)
CREATE TABLE IF NOT EXISTS revision_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    question_id VARCHAR(100) NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    scheduled_date DATE NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMPTZ,
    notes TEXT,
    interval_days INT DEFAULT 3,
    repetition_number INT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Daily Activity (Aggregated daily tracking for calendar, streak, and heatmaps)
CREATE TABLE IF NOT EXISTS daily_activity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    activity_date DATE NOT NULL,
    tasks_completed INT DEFAULT 0,
    tasks_planned INT DEFAULT 0,
    dsa_solved INT DEFAULT 0,
    dev_completed INT DEFAULT 0,
    study_minutes INT DEFAULT 0,
    reflection_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_user_daily_activity UNIQUE (user_id, activity_date)
);

-- 13. Notifications (In-app reminders, milestone celebrations, deadlines)
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL, -- task_due, revision_due, streak_milestone, interview_countdown, system
    is_read BOOLEAN DEFAULT FALSE,
    link_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for lightning fast lookups
CREATE INDEX IF NOT EXISTS idx_tasks_user_due ON tasks(user_id, due_date);
CREATE INDEX IF NOT EXISTS idx_task_completions_user_date ON task_completions(user_id, completion_date);
CREATE INDEX IF NOT EXISTS idx_daily_activity_user_date ON daily_activity(user_id, activity_date);
CREATE INDEX IF NOT EXISTS idx_revisions_user_date ON revision_schedules(user_id, scheduled_date);
CREATE INDEX IF NOT EXISTS idx_user_question_progress_user ON user_question_progress(user_id, status);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user ON bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_questions_type_category ON questions(type, category);

-- Supabase RLS Compatibility
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE preparation_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_question_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE revision_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
