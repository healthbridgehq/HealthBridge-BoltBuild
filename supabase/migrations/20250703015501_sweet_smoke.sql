/*
  # Create PBS-Compliant Prescription Management System

  1. New Tables
    - `medications`
      - Master medication database with PBS codes
    - `prescriptions`
      - Individual prescription records
    - `prescription_items`
      - Line items for each prescription
    - `drug_interactions`
      - Drug interaction warnings database

  2. Security
    - Enable RLS on all tables
    - Add policies for prescription access control
    - Implement provider-only prescription creation
*/

-- Create medications table (PBS medication database)
CREATE TABLE IF NOT EXISTS medications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  pbs_code text UNIQUE,
  medication_name text NOT NULL,
  generic_name text,
  brand_name text,
  strength text,
  form text NOT NULL, -- tablet, capsule, liquid, etc.
  manufacturer text,
  atc_code text, -- Anatomical Therapeutic Chemical code
  schedule text, -- S2, S3, S4, S8 etc.
  pbs_listed boolean DEFAULT false,
  pbs_price decimal(10,2),
  private_price decimal(10,2),
  is_active boolean DEFAULT true,
  contraindications text[],
  side_effects text[],
  dosage_instructions text
);

-- Create prescriptions table
CREATE TABLE IF NOT EXISTS prescriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  patient_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  provider_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  prescription_number text UNIQUE NOT NULL,
  prescription_date date NOT NULL DEFAULT CURRENT_DATE,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'dispensed', 'cancelled', 'expired')),
  prescription_type text NOT NULL DEFAULT 'new' CHECK (prescription_type IN ('new', 'repeat', 'authority')),
  repeats_allowed integer DEFAULT 0,
  repeats_remaining integer DEFAULT 0,
  authority_number text, -- For PBS authority prescriptions
  notes text,
  pharmacy_id uuid, -- Reference to dispensing pharmacy
  dispensed_date timestamptz,
  expiry_date date,
  electronic_signature text,
  is_urgent boolean DEFAULT false
);

-- Create prescription_items table
CREATE TABLE IF NOT EXISTS prescription_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  prescription_id uuid REFERENCES prescriptions(id) ON DELETE CASCADE,
  medication_id uuid REFERENCES medications(id),
  medication_name text NOT NULL, -- Fallback if not in medications table
  strength text,
  form text,
  quantity integer NOT NULL,
  dosage_instructions text NOT NULL,
  frequency text NOT NULL,
  duration_days integer,
  substitution_allowed boolean DEFAULT true,
  pbs_item_code text,
  cost_to_patient decimal(10,2),
  government_benefit decimal(10,2)
);

-- Create drug_interactions table
CREATE TABLE IF NOT EXISTS drug_interactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  medication_a_id uuid REFERENCES medications(id),
  medication_b_id uuid REFERENCES medications(id),
  interaction_type text NOT NULL CHECK (interaction_type IN ('major', 'moderate', 'minor')),
  description text NOT NULL,
  clinical_effect text,
  management_advice text,
  is_active boolean DEFAULT true
);

-- Enable Row Level Security
ALTER TABLE medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescription_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE drug_interactions ENABLE ROW LEVEL SECURITY;

-- Policies for medications (public read for providers)
CREATE POLICY "Providers can read medications"
  ON medications
  FOR SELECT
  TO authenticated
  USING (
    is_active = true AND
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid()
      AND role = 'provider'
    )
  );

CREATE POLICY "Providers can manage medications"
  ON medications
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid()
      AND role = 'provider'
    )
  );

-- Policies for prescriptions
CREATE POLICY "Users can read their own prescriptions"
  ON prescriptions
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = patient_id OR 
    auth.uid() = provider_id
  );

CREATE POLICY "Providers can create prescriptions"
  ON prescriptions
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = provider_id AND
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid()
      AND role = 'provider'
    )
  );

CREATE POLICY "Providers can update their own prescriptions"
  ON prescriptions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = provider_id);

-- Policies for prescription_items
CREATE POLICY "Users can read prescription items for their prescriptions"
  ON prescription_items
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM prescriptions
      WHERE id = prescription_id
      AND (patient_id = auth.uid() OR provider_id = auth.uid())
    )
  );

CREATE POLICY "Providers can manage prescription items"
  ON prescription_items
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM prescriptions p
      WHERE p.id = prescription_id
      AND p.provider_id = auth.uid()
    )
  );

-- Policies for drug_interactions (read-only for providers)
CREATE POLICY "Providers can read drug interactions"
  ON drug_interactions
  FOR SELECT
  TO authenticated
  USING (
    is_active = true AND
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid()
      AND role = 'provider'
    )
  );

-- Insert sample PBS medications
INSERT INTO medications (pbs_code, medication_name, generic_name, brand_name, strength, form, schedule, pbs_listed, pbs_price, private_price) VALUES
  ('1234A', 'Paracetamol', 'Paracetamol', 'Panadol', '500mg', 'tablet', 'S2', true, 5.99, 8.99),
  ('5678B', 'Amoxicillin', 'Amoxicillin', 'Amoxil', '500mg', 'capsule', 'S4', true, 12.50, 18.99),
  ('9012C', 'Atorvastatin', 'Atorvastatin', 'Lipitor', '20mg', 'tablet', 'S4', true, 15.99, 25.99),
  ('3456D', 'Metformin', 'Metformin', 'Diabex', '500mg', 'tablet', 'S4', true, 8.99, 14.99),
  ('7890E', 'Salbutamol', 'Salbutamol', 'Ventolin', '100mcg', 'inhaler', 'S3', true, 11.99, 16.99);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_prescriptions_patient_id ON prescriptions(patient_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_provider_id ON prescriptions(provider_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_date ON prescriptions(prescription_date DESC);
CREATE INDEX IF NOT EXISTS idx_prescriptions_status ON prescriptions(status);
CREATE INDEX IF NOT EXISTS idx_prescription_items_prescription_id ON prescription_items(prescription_id);
CREATE INDEX IF NOT EXISTS idx_medications_pbs_code ON medications(pbs_code);
CREATE INDEX IF NOT EXISTS idx_medications_name ON medications(medication_name);

-- Function to generate prescription number
CREATE OR REPLACE FUNCTION generate_prescription_number()
RETURNS TEXT AS $$
DECLARE
  new_number TEXT;
BEGIN
  new_number := 'RX' || TO_CHAR(NOW(), 'YYYYMMDD') || LPAD(NEXTVAL('prescription_number_seq')::TEXT, 4, '0');
  RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- Create sequence for prescription numbers
CREATE SEQUENCE IF NOT EXISTS prescription_number_seq START 1;

-- Function to auto-generate prescription number
CREATE OR REPLACE FUNCTION set_prescription_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.prescription_number IS NULL THEN
    NEW.prescription_number := generate_prescription_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate prescription number
CREATE TRIGGER set_prescription_number_trigger
  BEFORE INSERT ON prescriptions
  FOR EACH ROW
  EXECUTE FUNCTION set_prescription_number();