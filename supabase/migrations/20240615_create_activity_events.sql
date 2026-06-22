-- Create activity_events table for unified activity tracking
-- This replaces the need for querying multiple tables for activity feeds
-- and avoids the complexity of a full report_edits system

CREATE TABLE activity_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  report_id UUID REFERENCES reports(id) ON DELETE CASCADE,
  
  event_type TEXT NOT NULL,
  event_title TEXT NOT NULL,
  event_description TEXT,
  event_metadata JSONB DEFAULT '{}',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Event types:
-- log_created - User created a logbook entry
-- image_uploaded - User uploaded an image
-- voice_uploaded - User recorded a voice note
-- chapter_generated - AI generated a chapter
-- chapter_edited - User edited a chapter
-- report_exported - User exported report to PDF
-- payment_completed - User completed a payment
-- report_created - User created a new report
-- report_submitted - User submitted report for review

-- Create indexes for performance
-- Composite index for dashboard activity feed (most frequent query)
CREATE INDEX idx_activity_events_user_created_at ON activity_events(user_id, created_at DESC);
CREATE INDEX idx_activity_events_report_id ON activity_events(report_id);
CREATE INDEX idx_activity_events_event_type ON activity_events(event_type);

-- Enable RLS
ALTER TABLE activity_events ENABLE ROW LEVEL SECURITY;

-- Users can only see their own activity events
CREATE POLICY "Users can view own activity events"
  ON activity_events FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own activity events
CREATE POLICY "Users can insert own activity events"
  ON activity_events FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Function to log activity events
CREATE OR REPLACE FUNCTION log_activity_event(
  p_user_id UUID,
  p_event_type TEXT,
  p_event_title TEXT,
  p_event_description TEXT DEFAULT NULL,
  p_report_id UUID DEFAULT NULL,
  p_event_metadata JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
  v_event_id UUID;
BEGIN
  INSERT INTO activity_events (user_id, event_type, event_title, event_description, report_id, event_metadata)
  VALUES (p_user_id, p_event_type, p_event_title, p_event_description, p_report_id, p_event_metadata)
  RETURNING id INTO v_event_id;
  
  RETURN v_event_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
