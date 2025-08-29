import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  profile: any | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string, role: 'patient' | 'provider') => Promise<void>;
  signOut: () => Promise<void>;
  loadUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  loading: true,
  signIn: async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  },
  signUp: async (email, password, fullName, role) => {
    const { data: { user }, error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: {
          full_name: fullName,
          role
        }
      }
    });
    if (error) throw error;
    if (!user) throw new Error('User creation failed');

    // Generate key pair for encryption
    const keyPair = await window.crypto.subtle.generateKey(
      {
        name: "RSA-OAEP",
        modulusLength: 4096,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-256",
      },
      true,
      ["encrypt", "decrypt"]
    );

    // Export public key
    const publicKey = await window.crypto.subtle.exportKey(
      "spki",
      keyPair.publicKey
    );
    const publicKeyString = btoa(String.fromCharCode(...new Uint8Array(publicKey)));

    // Create user profile with public key
    const { error: profileError } = await supabase
      .from('user_profiles')
      .insert({
        user_id: user.id,
        full_name: fullName,
        role,
        public_key: publicKeyString
      });

    if (profileError) throw profileError;

    // Store private key securely
    const privateKey = await window.crypto.subtle.exportKey(
      "pkcs8",
      keyPair.privateKey
    );
    const privateKeyString = btoa(String.fromCharCode(...new Uint8Array(privateKey)));
    sessionStorage.setItem('privateKey', privateKeyString);
  },
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    set({ user: null, profile: null });
    sessionStorage.removeItem('privateKey');
  },
  loadUser: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();
        set({ user, profile, loading: false });
      } else {
        set({ user: null, profile: null, loading: false });
      }
    } catch (error) {
      console.warn('Auth loading failed, using preview mode:', error);
      set({ user: null, profile: null, loading: false });
    }
  }
}));