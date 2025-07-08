/*
  # Create Integration Hub System

  1. New Tables
    - `external_integrations`
      - Manages third-party system connections
    - `integration_logs`
      - Tracks data sync activities and errors
    - `mhr_sync_records`
      - My Health Record synchronization data
    - `pathology_results`
      - Automated pathology lab result imports

  2. Security
    - Enable RLS on all tables
    - Add policies for integration access control
    - Implement secure API key management
*/

-- Create external_integrations table
CREATE TABLE IF NOT EXISTS external_integrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  provider_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  integration_type text NOT NULL CHECK (integration_type IN ('mhr', 'pathology', 'imaging', 'pharmacy', 'specialist', 'billing')),
  integration_name text NOT NULL,
  api_endpoint text,
  api_key_encrypted text,
  configuration jsonb DEFAULT '{}'::jsonb,
  is_active boolean DEFAULT true,
  last_sync_at timestamptz,
  sync_frequency_hours integer DEFAULT 24,
  auto_sync_enabled boolean DEFAULT false,
  error_count integer DEFAULT 0,
  last_error_message text,
  credentials_expires_at timestamptz
);

-- Create integration_logs table
CREATE TABLE IF NOT EXISTS integration_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  integration_id uuid REFERENCES external_integrations(id) ON DELETE CASCADE,
  sync_type text NOT NULL CHECK (sync_type IN ('manual', 'automatic', 'scheduled')),
  operation text NOT NULL CHECK (operation IN ('import', 'export', 'sync', 'validate')),
  status text NOT NULL CHECK (status IN ('started', 'in_progress', 'completed', 'failed', 'cancelled')),
  records_processed integer DEFAULT 0,
  records_successful integer DEFAULT 0,
  records_failed integer DEFAULT 0,
  error_details jsonb,
  execution_time_ms integer,
  data_summary jsonb
);

-- Create mhr_sync_records table
CREATE TABLE IF NOT EXISTS mhr_sync_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  patient_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  mhr_record_id text UNIQUE NOT NULL,
  record_type text NOT NULL,
  sync_status text NOT NULL DEFAULT 'pending' CHECK (sync_status IN ('pending', 'synced', 'conflict', 'failed')),
  local_record_id uuid,
  mhr_last_modified timestamptz,
  local_last_modified timestamptz,
  conflict_resolution text CHECK (conflict_resolution IN ('use_mhr', 'use_local', 'manual_review')),
  sync_direction text CHECK (sync_direction IN ('import', 'export', 'bidirectional')),
  data_hash text,
  consent_status text NOT NULL DEFAULT 'pending' CHECK (consent_status IN ('granted', 'denied', 'pending', 'expired'))
);

-- Create pathology_results table
CREATE TABLE IF NOT EXISTS pathology_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  patient_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  provider_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  lab_name text NOT NULL,
  lab_reference_number text UNIQUE NOT NULL,
  collection_date date NOT NULL,
  reported_date date NOT NULL,
  test_category text NOT NULL,
  test_name text NOT NULL,
  result_value text,
  reference_range text,
  units text,
  abnormal_flag text CHECK (abnormal_flag IN ('normal', 'high', 'low', 'critical', 'abnormal')),
  status text NOT NULL DEFAULT 'final' CHECK (status IN ('preliminary', 'final', 'corrected', 'cancelled')),
  clinical_notes text,
  ordering_provider text,
  result_data jsonb,
  is_critical boolean DEFAULT false,
  notification_sent boolean DEFAULT false,
  reviewed_by uuid REFERENCES auth.users(id),
  reviewed_at timestamptz
);

-- Enable Row Level Security
ALTER TABLE external_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE integration_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE mhr_sync_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE pathology_results ENABLE ROW LEVEL SECURITY;

-- Policies for external_integrations
CREATE POLICY "Providers can manage their own integrations"
  ON external_integrations
  FOR ALL
  TO authenticated
  USING (
    auth.uid() = provider_id AND
    EXISTS (SELECT 1 FROM user_profiles WHERE user_id = auth.uid() AND role = 'provider')
  );

-- Policies for integration_logs
CREATE POLICY "Providers can view logs for their integrations"
  ON integration_logs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM external_integrations
      WHERE id = integration_id
      AND provider_id = auth.uid()
    )
  );

-- Policies for mhr_sync_records
CREATE POLICY "Users can access their own MHR sync records"
  ON mhr_sync_records
  FOR ALL
  TO authenticated
  USING (auth.uid() = patient_id);

CREATE POLICY "Providers can view MHR sync records for their patients"
  ON mhr_sync_records
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM appointments
      WHERE patient_id = mhr_sync_records.patient_id
      AND provider_id = auth.uid()
    )
  );

-- Policies for pathology_results
CREATE POLICY "Users can access their own pathology results"
  ON pathology_results
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = patient_id OR 
    auth.uid() = provider_id OR
    auth.uid() = reviewed_by
  );

CREATE POLICY "Providers can manage pathology results"
  ON pathology_results
  FOR ALL
  TO authenticated
  USING (
    auth.uid() = provider_id AND
    EXISTS (SELECT 1 FROM user_profiles WHERE user_id = auth.uid() AND role = 'provider')
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_external_integrations_provider_id ON external_integrations(provider_id);
CREATE INDEX IF NOT EXISTS idx_external_integrations_type ON external_integrations(integration_type);
CREATE INDEX IF NOT EXISTS idx_integration_logs_integration_id ON integration_logs(integration_id);
CREATE INDEX IF NOT EXISTS idx_integration_logs_created_at ON integration_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_mhr_sync_patient_id ON mhr_sync_records(patient_id);
CREATE INDEX IF NOT EXISTS idx_mhr_sync_status ON mhr_sync_records(sync_status);
CREATE INDEX IF NOT EXISTS idx_pathology_patient_id ON pathology_results(patient_id);
CREATE INDEX IF NOT EXISTS idx_pathology_provider_id ON pathology_results(provider_id);
CREATE INDEX IF NOT EXISTS idx_pathology_collection_date ON pathology_results(collection_date DESC);

-- Function to encrypt API keys
CREATE OR REPLACE FUNCTION encrypt_api_key(api_key text)
RETURNS text AS $$
BEGIN
  -- In production, this would use proper encryption
  -- For now, we'll use a simple encoding
  RETURN encode(digest(api_key, 'sha256'), 'hex');
END;
$$ LANGUAGE plpgsql;

-- Function to log integration activity
CREATE OR REPLACE FUNCTION log_integration_activity(
  integration_uuid uuid,
  sync_type_param text,
  operation_param text,
  status_param text,
  records_processed_param integer DEFAULT 0,
  error_details_param jsonb DEFAULT NULL
)
RETURNS uuid AS $$
DECLARE
  log_id uuid;
BEGIN
  INSERT INTO integration_logs (
    integration_id,
    sync_type,
    operation,
    status,
    records_processed,
    error_details
  ) VALUES (
    integration_uuid,
    sync_type_param,
    operation_param,
    status_param,
    records_processed_param,
    error_details_param
  ) RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$$ LANGUAGE plpgsql;