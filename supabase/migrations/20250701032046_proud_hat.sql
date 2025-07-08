/*
  # Fix User Registration Issues

  1. Changes
    - Create a more permissive policy for user profile creation during signup
    - Allow authenticated users to create their own profiles
    - Fix the RLS policy that's blocking registration

  2. Security
    - Maintain security while allowing necessary profile creation
    - Users can only create profiles for themselves
*/

-- Drop existing problematic policies
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Enable profile creation during signup" ON user_profiles;
    DROP POLICY IF EXISTS "Users can create their own profile" ON user_profiles;
EXCEPTION
    WHEN OTHERS THEN NULL;
END $$;

-- Create a simple, working policy for profile creation
CREATE POLICY "Allow users to create their own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Also allow patients to create health records (not just providers)
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Providers can create records" ON health_records;
EXCEPTION
    WHEN OTHERS THEN NULL;
END $$;

CREATE POLICY "Users can create health records"
  ON health_records
  FOR INSERT
  TO authenticated
  WITH CHECK (
    -- Allow if user is the patient creating their own record
    auth.uid() = patient_id
    OR
    -- Or if user is a provider (existing functionality)
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid()
      AND role = 'provider'
    )
  );