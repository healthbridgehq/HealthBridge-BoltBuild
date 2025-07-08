/*
  # Initial Schema Setup for HealthBridge

  1. New Tables
    - `user_profiles`
      - Stores user information and role (patient/provider)
      - Contains public key for encryption
    - `health_records`
      - Stores encrypted health records
      - Includes sharing controls and metadata

  2. Security
    - Enable RLS on all tables
    - Add policies for data access control
    - Implement role-based access
*/

-- Create user_profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  role text NOT NULL CHECK (role IN ('patient', 'provider')),
  provider_type text,
  clinic_id uuid,
  public_key text NOT NULL,
  UNIQUE(user_id)
);

-- Create health_records table if it doesn't exist
CREATE TABLE IF NOT EXISTS health_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  patient_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  provider_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  record_type text NOT NULL,
  content jsonb,
  encrypted_content text NOT NULL,
  is_shared boolean DEFAULT false,
  shared_with uuid[] DEFAULT '{}'::uuid[]
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_records ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Users can create their own profile" ON user_profiles;
    DROP POLICY IF EXISTS "Users can read own profile" ON user_profiles;
    DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
    DROP POLICY IF EXISTS "Patients can read own records" ON health_records;
    DROP POLICY IF EXISTS "Providers can create records" ON health_records;
    DROP POLICY IF EXISTS "Patients can share own records" ON health_records;
EXCEPTION
    WHEN OTHERS THEN
    NULL;
END $$;

-- Recreate policies for user_profiles
CREATE POLICY "Users can create their own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Recreate policies for health_records
CREATE POLICY "Patients can read own records"
  ON health_records
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = patient_id OR 
    auth.uid() = provider_id OR 
    auth.uid() = ANY(shared_with)
  );

CREATE POLICY "Providers can create records"
  ON health_records
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid()
      AND role = 'provider'
    )
  );

CREATE POLICY "Patients can share own records"
  ON health_records
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = patient_id)
  WITH CHECK (auth.uid() = patient_id);

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_health_records_patient_id ON health_records(patient_id);
CREATE INDEX IF NOT EXISTS idx_health_records_provider_id ON health_records(provider_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);