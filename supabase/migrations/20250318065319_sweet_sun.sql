/*
  # Fix user profile creation policy

  1. Changes
    - Modify the user profile creation policy to allow new signups
    - Add policy for service role access
  
  2. Security
    - Maintain RLS protection while allowing necessary operations
    - Ensure secure profile creation during signup
*/

-- Drop the existing insert policy
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Users can create their own profile" ON user_profiles;
EXCEPTION
    WHEN OTHERS THEN NULL;
END $$;

-- Create a more permissive insert policy that allows profile creation during signup
CREATE POLICY "Enable profile creation during signup"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (
    -- Allow if the user is creating their own profile
    auth.uid() = user_id
    OR
    -- Or if the user doesn't have a profile yet (for signup)
    NOT EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid()
    )
  );

-- Add a policy for service role access (needed for administrative functions)
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Service role full access" ON user_profiles;
EXCEPTION
    WHEN OTHERS THEN NULL;
END $$;

CREATE POLICY "Service role full access"
  ON user_profiles
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);