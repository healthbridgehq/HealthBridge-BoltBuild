/*
  # Create Advanced Analytics System

  1. New Tables
    - `practice_metrics`
      - Stores daily practice performance metrics
    - `clinical_outcomes`
      - Tracks patient outcomes and treatment effectiveness
    - `financial_transactions`
      - Records billing and payment data
    - `population_health_data`
      - Aggregated community health insights

  2. Security
    - Enable RLS on all tables
    - Add policies for analytics access control
    - Implement provider-only access for sensitive data
*/

-- Create practice_metrics table
CREATE TABLE IF NOT EXISTS practice_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  provider_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  metric_date date NOT NULL DEFAULT CURRENT_DATE,
  total_appointments integer DEFAULT 0,
  completed_appointments integer DEFAULT 0,
  cancelled_appointments integer DEFAULT 0,
  no_show_appointments integer DEFAULT 0,
  average_consultation_time_minutes decimal(5,2),
  patient_satisfaction_score decimal(3,2),
  revenue_generated decimal(10,2),
  new_patients integer DEFAULT 0,
  follow_up_appointments integer DEFAULT 0,
  telehealth_appointments integer DEFAULT 0,
  emergency_consultations integer DEFAULT 0,
  prescriptions_issued integer DEFAULT 0,
  referrals_made integer DEFAULT 0
);

-- Create clinical_outcomes table
CREATE TABLE IF NOT EXISTS clinical_outcomes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  patient_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  provider_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  condition_code text NOT NULL, -- ICD-10-AM codes
  condition_name text NOT NULL,
  treatment_start_date date NOT NULL,
  treatment_end_date date,
  outcome_measure text NOT NULL,
  baseline_value decimal(10,2),
  current_value decimal(10,2),
  target_value decimal(10,2),
  improvement_percentage decimal(5,2),
  outcome_status text CHECK (outcome_status IN ('improving', 'stable', 'declining', 'resolved')),
  notes text,
  last_assessment_date date
);

-- Create financial_transactions table
CREATE TABLE IF NOT EXISTS financial_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  provider_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  patient_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  appointment_id uuid REFERENCES appointments(id),
  transaction_type text NOT NULL CHECK (transaction_type IN ('consultation', 'procedure', 'medication', 'bulk_billing', 'private_billing')),
  item_number text, -- Medicare item numbers
  description text NOT NULL,
  amount_charged decimal(10,2) NOT NULL,
  medicare_benefit decimal(10,2),
  patient_contribution decimal(10,2),
  gap_payment decimal(10,2),
  payment_status text NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'partially_paid', 'overdue', 'written_off')),
  payment_method text CHECK (payment_method IN ('cash', 'card', 'eftpos', 'bank_transfer', 'medicare', 'insurance')),
  transaction_date date NOT NULL DEFAULT CURRENT_DATE,
  due_date date,
  paid_date date
);

-- Create population_health_data table
CREATE TABLE IF NOT EXISTS population_health_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  provider_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  data_period_start date NOT NULL,
  data_period_end date NOT NULL,
  age_group text NOT NULL,
  gender text,
  postcode text,
  condition_prevalence jsonb, -- {"diabetes": 15.2, "hypertension": 28.5}
  vaccination_rates jsonb,
  chronic_disease_management jsonb,
  preventive_care_uptake jsonb,
  health_risk_factors jsonb,
  social_determinants jsonb,
  total_population_sample integer
);

-- Enable Row Level Security
ALTER TABLE practice_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinical_outcomes ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE population_health_data ENABLE ROW LEVEL SECURITY;

-- Policies for practice_metrics
CREATE POLICY "Providers can access their own practice metrics"
  ON practice_metrics
  FOR ALL
  TO authenticated
  USING (auth.uid() = provider_id)
  WITH CHECK (auth.uid() = provider_id);

-- Policies for clinical_outcomes
CREATE POLICY "Providers can access clinical outcomes for their patients"
  ON clinical_outcomes
  FOR ALL
  TO authenticated
  USING (
    auth.uid() = provider_id OR
    (auth.uid() = patient_id AND 
     EXISTS (SELECT 1 FROM user_profiles WHERE user_id = auth.uid() AND role = 'patient'))
  );

-- Policies for financial_transactions
CREATE POLICY "Providers can access their financial transactions"
  ON financial_transactions
  FOR ALL
  TO authenticated
  USING (
    auth.uid() = provider_id OR
    (auth.uid() = patient_id AND 
     EXISTS (SELECT 1 FROM user_profiles WHERE user_id = auth.uid() AND role = 'patient'))
  );

-- Policies for population_health_data
CREATE POLICY "Providers can access population health data"
  ON population_health_data
  FOR ALL
  TO authenticated
  USING (
    auth.uid() = provider_id AND
    EXISTS (SELECT 1 FROM user_profiles WHERE user_id = auth.uid() AND role = 'provider')
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_practice_metrics_provider_date ON practice_metrics(provider_id, metric_date DESC);
CREATE INDEX IF NOT EXISTS idx_clinical_outcomes_patient_id ON clinical_outcomes(patient_id);
CREATE INDEX IF NOT EXISTS idx_clinical_outcomes_provider_id ON clinical_outcomes(provider_id);
CREATE INDEX IF NOT EXISTS idx_financial_transactions_provider_id ON financial_transactions(provider_id);
CREATE INDEX IF NOT EXISTS idx_financial_transactions_patient_id ON financial_transactions(patient_id);
CREATE INDEX IF NOT EXISTS idx_financial_transactions_date ON financial_transactions(transaction_date DESC);
CREATE INDEX IF NOT EXISTS idx_population_health_provider_id ON population_health_data(provider_id);

-- Function to calculate daily practice metrics
CREATE OR REPLACE FUNCTION calculate_daily_metrics(provider_uuid uuid, metric_date date)
RETURNS void AS $$
BEGIN
  INSERT INTO practice_metrics (
    provider_id,
    metric_date,
    total_appointments,
    completed_appointments,
    cancelled_appointments,
    no_show_appointments,
    average_consultation_time_minutes,
    telehealth_appointments,
    prescriptions_issued
  )
  SELECT 
    provider_uuid,
    metric_date,
    COUNT(*) as total_appointments,
    COUNT(*) FILTER (WHERE status = 'completed') as completed_appointments,
    COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled_appointments,
    COUNT(*) FILTER (WHERE status = 'no_show') as no_show_appointments,
    AVG(duration_minutes) as average_consultation_time_minutes,
    COUNT(*) FILTER (WHERE appointment_method = 'telehealth') as telehealth_appointments,
    (SELECT COUNT(*) FROM prescriptions WHERE provider_id = provider_uuid AND prescription_date = metric_date) as prescriptions_issued
  FROM appointments
  WHERE provider_id = provider_uuid 
    AND scheduled_date = metric_date
  ON CONFLICT (provider_id, metric_date) DO UPDATE SET
    total_appointments = EXCLUDED.total_appointments,
    completed_appointments = EXCLUDED.completed_appointments,
    cancelled_appointments = EXCLUDED.cancelled_appointments,
    no_show_appointments = EXCLUDED.no_show_appointments,
    average_consultation_time_minutes = EXCLUDED.average_consultation_time_minutes,
    telehealth_appointments = EXCLUDED.telehealth_appointments,
    prescriptions_issued = EXCLUDED.prescriptions_issued,
    created_at = now();
END;
$$ LANGUAGE plpgsql;

-- Add unique constraint for daily metrics
ALTER TABLE practice_metrics ADD CONSTRAINT unique_provider_date UNIQUE (provider_id, metric_date);