-- ============================================================================
-- PRODUCTION RECOVERY SQL
-- ============================================================================
-- Purpose: Make production database (migrations 001-011) match codebase expectations
-- Date: 2025-01-28
-- 
-- SAFETY RULES:
-- - Never DROP existing tables
-- - Never DROP existing columns
-- - Only CREATE missing objects
-- - Only ALTER tables to add missing columns
-- - IF NOT EXISTS everywhere possible
-- 
-- ROLLBACK NOTES:
-- - Each section can be rolled back individually
-- - Save this file before execution
-- - Test in staging environment first
-- ============================================================================

-- ============================================================================
-- SECTION 1: CREATE MISSING TABLES
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Table: weekly_logs
-- Purpose: Weekly logbook entries (referenced by dashboard/logbook/page.tsx)
-- Rollback: DROP TABLE IF EXISTS public.weekly_logs CASCADE;
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.weekly_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    report_id UUID REFERENCES public.reports(id) ON DELETE CASCADE,
    week_number INTEGER,
    title TEXT,
    content TEXT,
    ai_summary TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for weekly_logs
CREATE INDEX IF NOT EXISTS idx_weekly_logs_user ON public.weekly_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_weekly_logs_report ON public.weekly_logs(report_id);
CREATE INDEX IF NOT EXISTS idx_weekly_logs_week ON public.weekly_logs(week_number);

-- RLS for weekly_logs
ALTER TABLE public.weekly_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Users can view own weekly_logs"
ON public.weekly_logs FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can insert own weekly_logs"
ON public.weekly_logs FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can update own weekly_logs"
ON public.weekly_logs FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can delete own weekly_logs"
ON public.weekly_logs FOR DELETE
USING (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- Table: analytics_events
-- Purpose: Analytics tracking (referenced by lib/analytics.ts, lib/user-behavior.ts)
-- Rollback: DROP TABLE IF EXISTS public.analytics_events CASCADE;
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    event_category TEXT NOT NULL,
    event_name TEXT NOT NULL,
    properties JSONB DEFAULT '{}',
    page TEXT,
    referrer TEXT,
    user_agent TEXT,
    ip_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for analytics_events
CREATE INDEX IF NOT EXISTS idx_analytics_events_user ON public.analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON public.analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_category ON public.analytics_events(event_category);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created ON public.analytics_events(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_created ON public.analytics_events(user_id, created_at);

-- RLS for analytics_events
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Users can view their own analytics events"
ON public.analytics_events FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can insert their own analytics events"
ON public.analytics_events FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Admins can view all analytics events"
ON public.analytics_events FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);

-- ----------------------------------------------------------------------------
-- Table: beta_users
-- Purpose: Beta user access control (referenced by admin/page.tsx, lib/beta-access.ts)
-- Rollback: DROP TABLE IF EXISTS public.beta_users CASCADE;
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.beta_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    status TEXT DEFAULT 'pending',
    waitlist_joined_at TIMESTAMP WITH TIME ZONE,
    account_created_at TIMESTAMP WITH TIME ZONE,
    profile_completed_at TIMESTAMP WITH TIME ZONE,
    first_logbook_created_at TIMESTAMP WITH TIME ZONE,
    first_report_created_at TIMESTAMP WITH TIME ZONE,
    first_export_at TIMESTAMP WITH TIME ZONE,
    onboarding_step TEXT DEFAULT 'waitlist',
    conversion_rate NUMERIC DEFAULT 0,
    department TEXT,
    institution TEXT,
    referral_source TEXT,
    invited_at TIMESTAMP WITH TIME ZONE,
    approved_at TIMESTAMP WITH TIME ZONE,
    approved_by UUID REFERENCES auth.users(id),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for beta_users
CREATE INDEX IF NOT EXISTS idx_beta_users_user ON public.beta_users(user_id);
CREATE INDEX IF NOT EXISTS idx_beta_users_status ON public.beta_users(status);
CREATE INDEX IF NOT EXISTS idx_beta_users_onboarding_step ON public.beta_users(onboarding_step);
CREATE INDEX IF NOT EXISTS idx_beta_users_conversion ON public.beta_users(conversion_rate);

-- RLS for beta_users
ALTER TABLE public.beta_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Users can view their own beta status"
ON public.beta_users FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Admins can view all beta users"
ON public.beta_users FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);

CREATE POLICY IF NOT EXISTS "Admins can update beta user status"
ON public.beta_users FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);

CREATE POLICY IF NOT EXISTS "Admins can insert beta users"
ON public.beta_users FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);

-- ----------------------------------------------------------------------------
-- Table: feedback
-- Purpose: User feedback tracking (referenced by admin/page.tsx)
-- Rollback: DROP TABLE IF EXISTS public.feedback CASCADE;
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    message TEXT NOT NULL,
    page TEXT,
    status TEXT DEFAULT 'open',
    impact_score INTEGER DEFAULT 0,
    frequency_score INTEGER DEFAULT 0,
    priority_score INTEGER DEFAULT 0,
    priority_level TEXT DEFAULT 'medium',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for feedback
CREATE INDEX IF NOT EXISTS idx_feedback_user ON public.feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_feedback_status ON public.feedback(status);
CREATE INDEX IF NOT EXISTS idx_feedback_type ON public.feedback(type);
CREATE INDEX IF NOT EXISTS idx_feedback_created ON public.feedback(created_at);
CREATE INDEX IF NOT EXISTS idx_feedback_priority ON public.feedback(priority_level);
CREATE INDEX IF NOT EXISTS idx_feedback_priority_score ON public.feedback(priority_score DESC);

-- RLS for feedback
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Users can view their own feedback"
ON public.feedback FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can insert their own feedback"
ON public.feedback FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Admins can view all feedback"
ON public.feedback FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);

CREATE POLICY IF NOT EXISTS "Admins can update feedback status"
ON public.feedback FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);

-- ----------------------------------------------------------------------------
-- Table: report_quality
-- Purpose: Report quality tracking (referenced by lib/report-quality.ts)
-- Rollback: DROP TABLE IF EXISTS public.report_quality CASCADE;
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.report_quality (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    report_version_id UUID REFERENCES public.report_versions(id) ON DELETE CASCADE,
    edit_level TEXT NOT NULL,
    satisfaction_score INTEGER,
    feedback_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for report_quality
CREATE INDEX IF NOT EXISTS idx_report_quality_user ON public.report_quality(user_id);
CREATE INDEX IF NOT EXISTS idx_report_quality_report ON public.report_quality(report_version_id);
CREATE INDEX IF NOT EXISTS idx_report_quality_edit_level ON public.report_quality(edit_level);

-- RLS for report_quality
ALTER TABLE public.report_quality ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Users can view their own report quality"
ON public.report_quality FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can insert their own report quality"
ON public.report_quality FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Admins can view all report quality"
ON public.report_quality FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);

-- ----------------------------------------------------------------------------
-- Table: activity_events
-- Purpose: Unified activity tracking (referenced by dashboard/page.tsx)
-- Note: This is different from analytics_events - used for activity feed
-- Rollback: DROP TABLE IF EXISTS public.activity_events CASCADE;
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.activity_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    report_id UUID REFERENCES public.reports(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    event_title TEXT NOT NULL,
    event_description TEXT,
    event_metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Indexes for activity_events
CREATE INDEX IF NOT EXISTS idx_activity_events_user_created_at ON public.activity_events(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_events_report_id ON public.activity_events(report_id);
CREATE INDEX IF NOT EXISTS idx_activity_events_event_type ON public.activity_events(event_type);

-- RLS for activity_events
ALTER TABLE public.activity_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Users can view own activity events"
ON public.activity_events FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can insert own activity events"
ON public.activity_events FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- SECTION 2: ADD MISSING COLUMNS
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Column: profiles.current_level
-- Purpose: User's current academic level (referenced by dashboard/profile/onboarding)
-- Rollback: ALTER TABLE public.profiles DROP COLUMN IF EXISTS current_level;
-- ----------------------------------------------------------------------------
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS current_level TEXT;

-- ----------------------------------------------------------------------------
-- Column: reports.is_active
-- Purpose: Mark active report for dashboard (referenced by dashboard/page.tsx)
-- Rollback: ALTER TABLE public.reports DROP COLUMN IF EXISTS is_active;
-- ----------------------------------------------------------------------------
ALTER TABLE public.reports
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT FALSE;

-- ============================================================================
-- SECTION 3: CREATE MISSING FUNCTIONS
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Function: track_onboarding_event
-- Purpose: Track onboarding milestones (referenced by lib/beta-access.ts)
-- Rollback: DROP FUNCTION IF EXISTS public.track_onboarding_event CASCADE;
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.track_onboarding_event(
    p_user_id UUID,
    p_event_type TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_beta_user RECORD;
BEGIN
    -- Get or create beta user record
    SELECT * INTO v_beta_user
    FROM public.beta_users
    WHERE user_id = p_user_id;
    
    IF NOT FOUND THEN
        INSERT INTO public.beta_users (user_id, status, waitlist_joined_at)
        VALUES (p_user_id, 'pending', NOW());
    END IF;
    
    -- Update appropriate timestamp based on event type
    CASE p_event_type
        WHEN 'account_created' THEN
            UPDATE public.beta_users
            SET account_created_at = NOW()
            WHERE user_id = p_user_id;
        WHEN 'profile_completed' THEN
            UPDATE public.beta_users
            SET profile_completed_at = NOW()
            WHERE user_id = p_user_id;
        WHEN 'first_logbook_created' THEN
            UPDATE public.beta_users
            SET first_logbook_created_at = NOW()
            WHERE user_id = p_user_id;
        WHEN 'first_report_created' THEN
            UPDATE public.beta_users
            SET first_report_created_at = NOW()
            WHERE user_id = p_user_id;
        WHEN 'first_export' THEN
            UPDATE public.beta_users
            SET first_export_at = NOW()
            WHERE user_id = p_user_id;
    END CASE;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.track_onboarding_event TO authenticated;

-- ----------------------------------------------------------------------------
-- Function: update_beta_onboarding_step
-- Purpose: Auto-calculate onboarding step and conversion rate
-- Rollback: DROP FUNCTION IF EXISTS public.update_beta_onboarding_step CASCADE;
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.update_beta_onboarding_step()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    -- Calculate onboarding step based on completed milestones
    IF NEW.first_export_at IS NOT NULL THEN
        NEW.onboarding_step := 'exported';
        NEW.conversion_rate := 100;
    ELSIF NEW.first_report_created_at IS NOT NULL THEN
        NEW.onboarding_step := 'report_created';
        NEW.conversion_rate := 85.7;
    ELSIF NEW.first_logbook_created_at IS NOT NULL THEN
        NEW.onboarding_step := 'logbook_created';
        NEW.conversion_rate := 71.4;
    ELSIF NEW.profile_completed_at IS NOT NULL THEN
        NEW.onboarding_step := 'profile_completed';
        NEW.conversion_rate := 57.1;
    ELSIF NEW.account_created_at IS NOT NULL THEN
        NEW.onboarding_step := 'account_created';
        NEW.conversion_rate := 42.8;
    ELSIF NEW.approved_at IS NOT NULL THEN
        NEW.onboarding_step := 'approved';
        NEW.conversion_rate := 28.5;
    ELSIF NEW.waitlist_joined_at IS NOT NULL THEN
        NEW.onboarding_step := 'waitlist';
        NEW.conversion_rate := 14.2;
    END IF;
    
    RETURN NEW;
END;
$$;

-- ----------------------------------------------------------------------------
-- Function: calculate_feedback_priority
-- Purpose: Calculate feedback priority score
-- Rollback: DROP FUNCTION IF EXISTS public.calculate_feedback_priority CASCADE;
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.calculate_feedback_priority()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    -- Calculate priority score based on impact and frequency
    NEW.priority_score := (NEW.impact_score * 0.7) + (NEW.frequency_score * 0.3);
    
    -- Set priority level based on score
    IF NEW.priority_score >= 80 THEN
        NEW.priority_level := 'critical';
    ELSIF NEW.priority_score >= 60 THEN
        NEW.priority_level := 'high';
    ELSIF NEW.priority_score >= 40 THEN
        NEW.priority_level := 'medium';
    ELSE
        NEW.priority_level := 'low';
    END IF;
    
    RETURN NEW;
END;
$$;

-- ============================================================================
-- SECTION 4: CREATE MISSING TRIGGERS
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Trigger: beta_users_onboarding_step_trigger
-- Purpose: Auto-update onboarding step on beta_users changes
-- Rollback: DROP TRIGGER IF EXISTS beta_users_onboarding_step_trigger ON public.beta_users;
-- ----------------------------------------------------------------------------
DROP TRIGGER IF EXISTS beta_users_onboarding_step_trigger ON public.beta_users;
CREATE TRIGGER beta_users_onboarding_step_trigger
BEFORE INSERT OR UPDATE ON public.beta_users
FOR EACH ROW
EXECUTE FUNCTION public.update_beta_onboarding_step();

-- ----------------------------------------------------------------------------
-- Trigger: feedback_priority_calculation
-- Purpose: Auto-calculate feedback priority
-- Rollback: DROP TRIGGER IF EXISTS feedback_priority_calculation ON public.feedback;
-- ----------------------------------------------------------------------------
DROP TRIGGER IF EXISTS feedback_priority_calculation ON public.feedback;
CREATE TRIGGER feedback_priority_calculation
BEFORE INSERT OR UPDATE ON public.feedback
FOR EACH ROW
EXECUTE FUNCTION public.calculate_feedback_priority();

-- ----------------------------------------------------------------------------
-- Trigger: feedback_updated_at
-- Purpose: Auto-update updated_at timestamp on feedback
-- Rollback: DROP TRIGGER IF EXISTS feedback_updated_at ON public.feedback;
-- ----------------------------------------------------------------------------
DROP TRIGGER IF EXISTS feedback_updated_at ON public.feedback;
CREATE TRIGGER feedback_updated_at
BEFORE UPDATE ON public.feedback
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- ----------------------------------------------------------------------------
-- Trigger: beta_users_updated_at
-- Purpose: Auto-update updated_at timestamp on beta_users
-- Rollback: DROP TRIGGER IF EXISTS beta_users_updated_at ON public.beta_users;
-- ----------------------------------------------------------------------------
DROP TRIGGER IF EXISTS beta_users_updated_at ON public.beta_users;
CREATE TRIGGER beta_users_updated_at
BEFORE UPDATE ON public.beta_users
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================
-- Run these after execution to verify success:

-- Check all tables exist
-- SELECT table_name FROM information_schema.tables 
-- WHERE table_schema = 'public' 
-- AND table_name IN ('weekly_logs', 'analytics_events', 'beta_users', 'feedback', 'report_quality', 'activity_events')
-- ORDER BY table_name;

-- Check columns exist
-- SELECT column_name, data_type FROM information_schema.columns 
-- WHERE table_schema = 'public' 
-- AND table_name = 'profiles' AND column_name = 'current_level';

-- SELECT column_name, data_type FROM information_schema.columns 
-- WHERE table_schema = 'public' 
-- AND table_name = 'reports' AND column_name = 'is_active';

-- Check functions exist
-- SELECT routine_name FROM information_schema.routines 
-- WHERE routine_schema = 'public' 
-- AND routine_name = 'track_onboarding_event';

-- ============================================================================
-- END OF PRODUCTION RECOVERY SQL
-- ============================================================================
