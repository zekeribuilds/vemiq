-- Add is_active flag to reports table
-- This allows explicit selection of which report is "active" for a user
-- instead of relying on "most recent" heuristic

ALTER TABLE reports ADD COLUMN is_active BOOLEAN DEFAULT false;

-- Set most recent report as active for existing users
WITH latest_reports AS (
  SELECT DISTINCT ON (user_id) user_id, id
  FROM reports
  ORDER BY user_id, created_at DESC
)
UPDATE reports
SET is_active = true
WHERE id IN (SELECT id FROM latest_reports);

-- Create function to ensure only one active report per user
CREATE OR REPLACE FUNCTION ensure_single_active_report()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_active = true THEN
    UPDATE reports
    SET is_active = false
    WHERE user_id = NEW.user_id AND id != NEW.id AND is_active = true;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to enforce single active report
DROP TRIGGER IF EXISTS single_active_report_trigger ON reports;
CREATE TRIGGER single_active_report_trigger
  BEFORE INSERT OR UPDATE ON reports
  FOR EACH ROW EXECUTE FUNCTION ensure_single_active_report();
