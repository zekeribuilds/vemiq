-- ============================================================================
-- SAFE PRODUCTION PATCH SQL
-- ============================================================================
-- Purpose: Add missing objects to production (migrations 001-011) without dropping anything
-- Safe to execute on production immediately
-- Date: 2025-01-28
-- ============================================================================

-- SECTION 1: Add missing columns
-- ========================================

-- Add current_level to profiles (required by onboarding and dashboard)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS current_level TEXT;

-- Add is_active to reports (required by dashboard)
ALTER TABLE public.reports ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT FALSE;

-- SECTION 2: Create analytics_events table (from migration 015)
-- ========================================

CREATE TABLE IF NOT EXISTS public.analytics_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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

CREATE INDEX IF NOT EXISTS idx_analytics_events_user ON public.analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON public.analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_category ON public.analytics_events(event_category);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created ON public.analytics_events(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_created ON public.analytics_events(user_id, created_at);

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

-- SECTION 3: Create feedback table (from migration 015)
-- ========================================

CREATE TABLE IF NOT EXISTS public.feedback (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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

CREATE INDEX IF NOT EXISTS idx_feedback_user ON public.feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_feedback_status ON public.feedback(status);
CREATE INDEX IF NOT EXISTS idx_feedback_type ON public.feedback(type);
CREATE INDEX IF NOT EXISTS idx_feedback_created ON public.feedback(created_at);
CREATE INDEX IF NOT EXISTS idx_feedback_priority ON public.feedback(priority_level);
CREATE INDEX IF NOT EXISTS idx_feedback_priority_score ON public.feedback(priority_score DESC);

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

-- SECTION 4: Create beta_users table (from migration 015)
-- ========================================

CREATE TABLE IF NOT EXISTS public.beta_users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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

CREATE INDEX IF NOT EXISTS idx_beta_users_user ON public.beta_users(user_id);
CREATE INDEX IF NOT EXISTS idx_beta_users_status ON public.beta_users(status);
CREATE INDEX IF NOT EXISTS idx_beta_users_onboarding_step ON public.beta_users(onboarding_step);
CREATE INDEX IF NOT EXISTS idx_beta_users_conversion ON public.beta_users(conversion_rate);

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

-- SECTION 5: Create report_quality table (from migration 016)
-- ========================================

CREATE TABLE IF NOT EXISTS public.report_quality (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    report_version_id UUID REFERENCES public.report_versions(id) ON DELETE CASCADE,
    edit_level TEXT NOT NULL,
    satisfaction_score INTEGER,
    feedback_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_report_quality_user ON public.report_quality(user_id);
CREATE INDEX IF NOT EXISTS idx_report_quality_report ON public.report_quality(report_version_id);
CREATE INDEX IF NOT EXISTS idx_report_quality_edit_level ON public.report_quality(edit_level);

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

-- SECTION 6: Create activity_events table (from migration 20240615_create_activity_events)
-- ========================================

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

CREATE INDEX IF NOT EXISTS idx_activity_events_user_created_at ON public.activity_events(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_events_report_id ON public.activity_events(report_id);
CREATE INDEX IF NOT EXISTS idx_activity_events_event_type ON public.activity_events(event_type);

ALTER TABLE public.activity_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Users can view own activity events"
ON public.activity_events FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can insert own activity events"
ON public.activity_events FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- SECTION 7: Create weekly_logs table (inferred from code usage)
-- ========================================

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

CREATE INDEX IF NOT EXISTS idx_weekly_logs_user ON public.weekly_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_weekly_logs_report ON public.weekly_logs(report_id);
CREATE INDEX IF NOT EXISTS idx_weekly_logs_week ON public.weekly_logs(week_number);

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

-- SECTION 8: Create missing functions and triggers
-- ========================================

-- Function: track_onboarding_event (from migration 20240620_beta_onboarding_pipeline)
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
    SELECT * INTO v_beta_user
    FROM public.beta_users
    WHERE user_id = p_user_id;
    
    IF NOT FOUND THEN
        INSERT INTO public.beta_users (user_id, status, waitlist_joined_at)
        VALUES (p_user_id, 'pending', NOW());
    END IF;
    
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

GRANT EXECUTE ON FUNCTION public.track_onboarding_event TO authenticated;

-- Function: update_beta_onboarding_step (from migration 20240620_beta_onboarding_pipeline)
CREATE OR REPLACE FUNCTION public.update_beta_onboarding_step()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
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

-- Trigger: beta_users_onboarding_step_trigger
DROP TRIGGER IF EXISTS beta_users_onboarding_step_trigger ON public.beta_users;
CREATE TRIGGER beta_users_onboarding_step_trigger
BEFORE INSERT OR UPDATE ON public.beta_users
FOR EACH ROW
EXECUTE FUNCTION public.update_beta_onboarding_step();

-- Function: calculate_feedback_priority (from migration 016)
CREATE OR REPLACE FUNCTION public.calculate_feedback_priority()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.priority_score := (NEW.impact_score * 0.7) + (NEW.frequency_score * 0.3);
    
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

-- Trigger: feedback_priority_calculation
DROP TRIGGER IF EXISTS feedback_priority_calculation ON public.feedback;
CREATE TRIGGER feedback_priority_calculation
BEFORE INSERT OR UPDATE ON public.feedback
FOR EACH ROW
EXECUTE FUNCTION public.calculate_feedback_priority();

-- Trigger: feedback_updated_at
DROP TRIGGER IF EXISTS feedback_updated_at ON public.feedback;
CREATE TRIGGER feedback_updated_at
BEFORE UPDATE ON public.feedback
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger: beta_users_updated_at
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
