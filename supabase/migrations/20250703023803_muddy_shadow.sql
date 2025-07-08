/*
  # Extend User Profiles for Comprehensive Profile Management

  1. New Tables
    - `user_profile_details`
      - Extended personal information including cultural background
    - `user_contact_details`
      - Comprehensive contact information with multiple addresses
    - `user_healthcare_cards`
      - Medicare, DVA, private health insurance details
    - `user_emergency_contacts`
      - Emergency contact information
    - `user_medical_information`
      - Allergies, medications, conditions, blood type
    - `user_preferences`
      - Communication, notification, privacy, accessibility preferences

  2. Security
    - Enable RLS on all tables
    - Add policies for user data access control
    - Implement encryption for sensitive data
*/

-- Create user_profile_details table
CREATE TABLE IF NOT EXISTS user_profile_details (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  title text,
  first_name text NOT NULL,
  last_name text NOT NULL,
  preferred_name text,
  date_of_birth date NOT NULL,
  gender text,
  aboriginal_torres_strait boolean DEFAULT false,
  cultural_background text,
  preferred_language text DEFAULT 'English',
  interpreter_required boolean DEFAULT false,
  profile_photo_url text
);

-- Create user_contact_details table
CREATE TABLE IF NOT EXISTS user_contact_details (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  email text NOT NULL,
  mobile_phone text,
  home_phone text,
  work_phone text,
  residential_address jsonb NOT NULL DEFAULT '{}'::jsonb,
  postal_address jsonb DEFAULT '{}'::jsonb,
  postal_same_as_residential boolean DEFAULT true
);

-- Create user_healthcare_cards table
CREATE TABLE IF NOT EXISTS user_healthcare_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  medicare_number_encrypted text,
  medicare_expiry date,
  medicare_position text,
  dva_has_card boolean DEFAULT false,
  dva_card_type text,
  dva_number_encrypted text,
  private_health_has_insurance boolean DEFAULT false,
  private_health_provider text,
  private_health_number_encrypted text,
  private_health_level text,
  pension_card_has_card boolean DEFAULT false,
  pension_card_type text,
  pension_card_number_encrypted text
);

-- Create user_emergency_contacts table
CREATE TABLE IF NOT EXISTS user_emergency_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  relationship text NOT NULL,
  phone text NOT NULL,
  email text,
  is_primary boolean DEFAULT false,
  contact_order integer DEFAULT 1
);

-- Create user_medical_information table
CREATE TABLE IF NOT EXISTS user_medical_information (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  allergies text[] DEFAULT '{}'::text[],
  current_medications text[] DEFAULT '{}'::text[],
  medical_conditions text[] DEFAULT '{}'::text[],
  blood_type text,
  organ_donor boolean DEFAULT false,
  advance_directive boolean DEFAULT false,
  advance_directive_location text,
  additional_notes text
);

-- Create user_preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  communication_preferences jsonb DEFAULT '{
    "email": true,
    "sms": true,
    "phone": false,
    "post": false
  }'::jsonb,
  notification_preferences jsonb DEFAULT '{
    "appointments": true,
    "results": true,
    "reminders": true,
    "marketing": false
  }'::jsonb,
  privacy_preferences jsonb DEFAULT '{
    "shareWithMHR": true,
    "shareWithSpecialists": true,
    "shareWithPharmacy": true,
    "allowResearch": false
  }'::jsonb,
  accessibility_preferences jsonb DEFAULT '{
    "largeText": false,
    "highContrast": false,
    "screenReader": false,
    "audioAlerts": false
  }'::jsonb
);

-- Enable Row Level Security
ALTER TABLE user_profile_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_contact_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_healthcare_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_medical_information ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Policies for user_profile_details
CREATE POLICY "Users can manage their own profile details"
  ON user_profile_details
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policies for user_contact_details
CREATE POLICY "Users can manage their own contact details"
  ON user_contact_details
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policies for user_healthcare_cards
CREATE POLICY "Users can manage their own healthcare cards"
  ON user_healthcare_cards
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policies for user_emergency_contacts
CREATE POLICY "Users can manage their own emergency contacts"
  ON user_emergency_contacts
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policies for user_medical_information
CREATE POLICY "Users can manage their own medical information"
  ON user_medical_information
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Providers can read medical information for their patients"
  ON user_medical_information
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM appointments
      WHERE patient_id = user_medical_information.user_id
      AND provider_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM health_records
      WHERE patient_id = user_medical_information.user_id
      AND provider_id = auth.uid()
    )
  );

-- Policies for user_preferences
CREATE POLICY "Users can manage their own preferences"
  ON user_preferences
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_profile_details_user_id ON user_profile_details(user_id);
CREATE INDEX IF NOT EXISTS idx_user_contact_details_user_id ON user_contact_details(user_id);
CREATE INDEX IF NOT EXISTS idx_user_healthcare_cards_user_id ON user_healthcare_cards(user_id);
CREATE INDEX IF NOT EXISTS idx_user_emergency_contacts_user_id ON user_emergency_contacts(user_id);
CREATE INDEX IF NOT EXISTS idx_user_medical_information_user_id ON user_medical_information(user_id);
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);

-- Function to create default profile records
CREATE OR REPLACE FUNCTION create_default_profile_records()
RETURNS TRIGGER AS $$
BEGIN
  -- Create default profile details
  INSERT INTO user_profile_details (user_id, first_name, last_name)
  VALUES (NEW.user_id, COALESCE(NEW.full_name, 'User'), '');
  
  -- Create default contact details
  INSERT INTO user_contact_details (user_id, email)
  VALUES (NEW.user_id, NEW.user_id::text || '@temp.com');
  
  -- Create default healthcare cards
  INSERT INTO user_healthcare_cards (user_id)
  VALUES (NEW.user_id);
  
  -- Create default medical information
  INSERT INTO user_medical_information (user_id)
  VALUES (NEW.user_id);
  
  -- Create default preferences
  INSERT INTO user_preferences (user_id)
  VALUES (NEW.user_id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to create default profile records when user profile is created
CREATE TRIGGER create_default_profile_records_trigger
  AFTER INSERT ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION create_default_profile_records();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers to all profile tables
CREATE TRIGGER update_user_profile_details_updated_at
  BEFORE UPDATE ON user_profile_details
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_contact_details_updated_at
  BEFORE UPDATE ON user_contact_details
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_healthcare_cards_updated_at
  BEFORE UPDATE ON user_healthcare_cards
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_emergency_contacts_updated_at
  BEFORE UPDATE ON user_emergency_contacts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_medical_information_updated_at
  BEFORE UPDATE ON user_medical_information
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON user_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();