/*
  # Create Telehealth Platform System

  1. New Tables
    - `telehealth_sessions`
      - Manages video consultation sessions
    - `telehealth_recordings`
      - Stores session recordings and metadata
    - `digital_whiteboard_data`
      - Saves whiteboard content for sessions

  2. Security
    - Enable RLS on all tables
    - Add policies for session access control
    - Implement secure recording management
*/

-- Create telehealth_sessions table
CREATE TABLE IF NOT EXISTS telehealth_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  appointment_id uuid REFERENCES appointments(id) ON DELETE CASCADE,
  patient_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  provider_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  session_token text UNIQUE NOT NULL,
  room_id text UNIQUE NOT NULL,
  status text NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'waiting', 'active', 'completed', 'cancelled', 'failed')),
  started_at timestamptz,
  ended_at timestamptz,
  duration_minutes integer,
  recording_enabled boolean DEFAULT false,
  screen_sharing_enabled boolean DEFAULT false,
  whiteboard_enabled boolean DEFAULT true,
  session_notes text,
  technical_issues text,
  patient_joined_at timestamptz,
  provider_joined_at timestamptz,
  connection_quality jsonb
);

-- Create telehealth_recordings table
CREATE TABLE IF NOT EXISTS telehealth_recordings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  session_id uuid REFERENCES telehealth_sessions(id) ON DELETE CASCADE,
  recording_url text NOT NULL,
  file_size_mb decimal(10,2),
  duration_minutes integer,
  recording_type text NOT NULL CHECK (recording_type IN ('full_session', 'screen_share', 'audio_only')),
  encryption_key text,
  is_encrypted boolean DEFAULT true,
  retention_until date,
  access_granted_to uuid[] DEFAULT '{}'::uuid[],
  download_count integer DEFAULT 0
);

-- Create digital_whiteboard_data table
CREATE TABLE IF NOT EXISTS digital_whiteboard_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  session_id uuid REFERENCES telehealth_sessions(id) ON DELETE CASCADE,
  whiteboard_data jsonb NOT NULL,
  page_number integer DEFAULT 1,
  created_by uuid REFERENCES auth.users(id),
  is_final boolean DEFAULT false
);

-- Enable Row Level Security
ALTER TABLE telehealth_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE telehealth_recordings ENABLE ROW LEVEL SECURITY;
ALTER TABLE digital_whiteboard_data ENABLE ROW LEVEL SECURITY;

-- Policies for telehealth_sessions
CREATE POLICY "Users can access their own telehealth sessions"
  ON telehealth_sessions
  FOR ALL
  TO authenticated
  USING (
    auth.uid() = patient_id OR 
    auth.uid() = provider_id
  );

-- Policies for telehealth_recordings
CREATE POLICY "Users can access recordings of their sessions"
  ON telehealth_recordings
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM telehealth_sessions
      WHERE id = session_id
      AND (patient_id = auth.uid() OR provider_id = auth.uid())
    )
    OR auth.uid() = ANY(access_granted_to)
  );

CREATE POLICY "Providers can manage recordings"
  ON telehealth_recordings
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM telehealth_sessions
      WHERE id = session_id
      AND provider_id = auth.uid()
    )
  );

-- Policies for digital_whiteboard_data
CREATE POLICY "Users can access whiteboard data from their sessions"
  ON digital_whiteboard_data
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM telehealth_sessions
      WHERE id = session_id
      AND (patient_id = auth.uid() OR provider_id = auth.uid())
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_telehealth_sessions_appointment_id ON telehealth_sessions(appointment_id);
CREATE INDEX IF NOT EXISTS idx_telehealth_sessions_patient_id ON telehealth_sessions(patient_id);
CREATE INDEX IF NOT EXISTS idx_telehealth_sessions_provider_id ON telehealth_sessions(provider_id);
CREATE INDEX IF NOT EXISTS idx_telehealth_sessions_status ON telehealth_sessions(status);
CREATE INDEX IF NOT EXISTS idx_telehealth_recordings_session_id ON telehealth_recordings(session_id);
CREATE INDEX IF NOT EXISTS idx_digital_whiteboard_session_id ON digital_whiteboard_data(session_id);