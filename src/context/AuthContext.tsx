'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Profile, AddressData } from '@/lib/types';
import { db } from '@/lib/database';

interface AuthContextType {
  user: Profile | null;
  isLoading: boolean;
  loginWithGoogle: () => Promise<{ error: string | null }>;
  loginWithOTP: (email: string) => Promise<{ success: boolean; error: string | null }>;
  verifyOTP: (email: string, token: string) => Promise<{ success: boolean; error: string | null }>;
  logout: () => Promise<void>;
  updateUserAddress: (type: 'shipping' | 'billing', address: AddressData) => Promise<void>;
  updateProfileName: (name: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        syncProfile(session.user.id, session.user.email ?? '');
      } else {
        setIsLoading(false);
      }
    });

    // Listen for auth changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        syncProfile(session.user.id, session.user.email ?? '');
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const syncProfile = async (userId: string, email: string) => {
    try {
      let profile = await db.getProfile(userId);
      if (!profile) {
        // Auto-create profile on first sign-in
        profile = await db.upsertProfile({
          id: userId,
          email,
          name: email.split('@')[0],
          shipping_address: null,
          billing_address: null,
        });
      }
      setUser(profile);
    } catch (err) {
      console.error('Error syncing profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    return { error: error?.message ?? null };
  };

  const loginWithOTP = async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true },
    });
    return { success: !error, error: error?.message ?? null };
  };

  const verifyOTP = async (email: string, token: string) => {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email',
    });
    if (error) return { success: false, error: error.message };
    if (data.user) {
      await syncProfile(data.user.id, data.user.email ?? '');
    }
    return { success: true, error: null };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const updateUserAddress = async (type: 'shipping' | 'billing', address: AddressData) => {
    if (!user) return;
    const field = type === 'shipping' ? 'shipping_address' : 'billing_address';
    const updated = await db.updateProfile(user.id, { [field]: address });
    setUser(updated);
  };

  const updateProfileName = async (name: string) => {
    if (!user) return;
    const updated = await db.updateProfile(user.id, { name });
    setUser(updated);
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, loginWithGoogle, loginWithOTP, verifyOTP, logout, updateUserAddress, updateProfileName }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
