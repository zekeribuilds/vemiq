-- Create uploads table for unified file storage
-- Handles images, voice notes, and documents
-- Prevents scattered file storage logic

CREATE TABLE uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  report_id UUID REFERENCES reports(id) ON DELETE CASCADE,
  
  file_type TEXT NOT NULL, -- 'image', 'voice', 'document'
  storage_path TEXT NOT NULL, -- Supabase storage path
  file_name TEXT NOT NULL,
  mime_type TEXT,
  file_size BIGINT, -- in bytes
  
  metadata JSONB DEFAULT '{}', -- additional file metadata
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for performance
CREATE INDEX idx_uploads_user_id ON uploads(user_id);
CREATE INDEX idx_uploads_report_id ON uploads(report_id);
CREATE INDEX idx_uploads_file_type ON uploads(file_type);
CREATE INDEX idx_uploads_created_at ON uploads(created_at DESC);

-- Enable RLS
ALTER TABLE uploads ENABLE ROW LEVEL SECURITY;

-- Users can only see their own uploads
CREATE POLICY "Users can view own uploads"
  ON uploads FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own uploads
CREATE POLICY "Users can insert own uploads"
  ON uploads FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own uploads
CREATE POLICY "Users can delete own uploads"
  ON uploads FOR DELETE
  USING (auth.uid() = user_id);
