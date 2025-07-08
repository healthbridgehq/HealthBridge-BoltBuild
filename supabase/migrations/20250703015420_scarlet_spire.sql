/*
  # Create Appointments Management System

  1. New Tables
    - `appointments`
      - Stores appointment bookings between patients and providers
      - Includes scheduling, status tracking, and telehealth support
    - `appointment_types`
      - Defines available appointment types and durations
    - `provider_schedules`
      - Manages provider availability and working hours

  2. Security
    - Enable RLS on all tables
    - Add policies for appointment access control
    - Implement role-based scheduling permissions
*/

-- Create appointment_types table
CREATE TABLE IF NOT EXISTS appointment_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  name text NOT NULL,
  description text,
  duration_minutes integer NOT NULL DEFAULT 30,
  color text DEFAULT '#3B82F6',
  is_active boolean DEFAULT true
);

-- Create provider_schedules table
CREATE TABLE IF NOT EXISTS provider_schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  provider_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  day_of_week integer NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time time NOT NULL,
  end_time time NOT NULL,
  is_available boolean DEFAULT true,
  break_start_time time,
  break_end_time time
);

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  patient_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  provider_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  appointment_type_id uuid REFERENCES appointment_types(id),
  scheduled_date date NOT NULL,
  scheduled_time time NOT NULL,
  duration_minutes integer NOT NULL DEFAULT 30,
  status text NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show')),
  appointment_method text NOT NULL DEFAULT 'in_person' CHECK (appointment_method IN ('in_person', 'telehealth', 'phone')),
  notes text,
  cancellation_reason text,
  telehealth_link text,
  reminder_sent boolean DEFAULT false,
  created_by uuid REFERENCES auth.users(id)
);

-- Enable Row Level Security
ALTER TABLE appointment_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Policies for appointment_types (public read, admin write)
CREATE POLICY "Anyone can read appointment types"
  ON appointment_types
  FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Providers can manage appointment types"
  ON appointment_types
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid()
      AND role = 'provider'
    )
  );

-- Policies for provider_schedules
CREATE POLICY "Providers can manage their own schedules"
  ON provider_schedules
  FOR ALL
  TO authenticated
  USING (auth.uid() = provider_id)
  WITH CHECK (auth.uid() = provider_id);

CREATE POLICY "Anyone can read provider schedules"
  ON provider_schedules
  FOR SELECT
  TO authenticated
  USING (is_available = true);

-- Policies for appointments
CREATE POLICY "Users can read their own appointments"
  ON appointments
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = patient_id OR 
    auth.uid() = provider_id
  );

CREATE POLICY "Patients can create appointments"
  ON appointments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Users can update their own appointments"
  ON appointments
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = patient_id OR 
    auth.uid() = provider_id
  )
  WITH CHECK (
    auth.uid() = patient_id OR 
    auth.uid() = provider_id
  );

-- Insert default appointment types
INSERT INTO appointment_types (name, description, duration_minutes, color) VALUES
  ('General Consultation', 'Standard consultation appointment', 30, '#3B82F6'),
  ('Follow-up', 'Follow-up appointment for existing condition', 15, '#10B981'),
  ('Emergency', 'Urgent medical consultation', 45, '#EF4444'),
  ('Telehealth Consultation', 'Video consultation appointment', 30, '#8B5CF6'),
  ('Health Check', 'Routine health screening', 45, '#F59E0B'),
  ('Specialist Referral', 'Specialist consultation', 60, '#6366F1');

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_provider_id ON appointments(provider_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_provider_schedules_provider_id ON provider_schedules(provider_id);