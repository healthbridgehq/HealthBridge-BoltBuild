type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      health_records: {
        Row: {
          id: string
          created_at: string
          patient_id: string
          provider_id: string
          record_type: string
          content: Json
          encrypted_content: string
          is_shared: boolean
          shared_with: string[]
        }
        Insert: {
          id?: string
          created_at?: string
          patient_id: string
          provider_id: string
          record_type: string
          content?: Json
          encrypted_content: string
          is_shared?: boolean
          shared_with?: string[]
        }
        Update: {
          id?: string
          created_at?: string
          patient_id?: string
          provider_id?: string
          record_type?: string
          content?: Json
          encrypted_content?: string
          is_shared?: boolean
          shared_with?: string[]
        }
      }
      user_profiles: {
        Row: {
          id: string
          created_at: string
          user_id: string
          full_name: string
          role: 'patient' | 'provider'
          provider_type?: string
          clinic_id?: string
          public_key: string
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          full_name: string
          role: 'patient' | 'provider'
          provider_type?: string
          clinic_id?: string
          public_key: string
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          full_name?: string
          role?: 'patient' | 'provider'
          provider_type?: string
          clinic_id?: string
          public_key?: string
        }
      }
    }
  }
}