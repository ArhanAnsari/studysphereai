'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService, dbService } from '@/lib/appwrite-service';
import type { UserProfile } from '@/lib/appwrite-service';
import type { Models } from 'appwrite';

interface AuthContextType {
  user: Models.User<Models.Preferences> | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithGithub: () => Promise<void>;
  signInAnonymous: () => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        const userProfile = await authService.getUserProfile(currentUser.$id);
        setProfile(userProfile);
      }
    } catch (error) {
      console.log('No user logged in');
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      await authService.signIn(email, password);
      await checkUser();
      router.push('/dashboard');
    } catch (error: any) {
      throw new Error(error.message || 'Sign in failed');
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      await authService.signUp(email, password, name);
      await checkUser();
      router.push('/dashboard');
    } catch (error: any) {
      throw new Error(error.message || 'Sign up failed');
    }
  };

  const signInWithGoogle = async () => {
    try {
      await authService.signInWithGoogle();
      // OAuth will redirect, so we don't need to do anything else here
    } catch (error: any) {
      throw new Error(error.message || 'Google sign in failed');
    }
  };

  const signInWithGithub = async () => {
    try {
      await authService.signInWithGithub();
      // OAuth will redirect
    } catch (error: any) {
      throw new Error(error.message || 'GitHub sign in failed');
    }
  };

  const signInAnonymous = async () => {
    try {
      await authService.signInAnonymous();
      await checkUser();
      router.push('/dashboard');
    } catch (error: any) {
      throw new Error(error.message || 'Anonymous sign in failed');
    }
  };

  const signOut = async () => {
    try {
      await authService.signOut();
      setUser(null);
      setProfile(null);
      router.push('/');
    } catch (error: any) {
      throw new Error(error.message || 'Sign out failed');
    }
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!profile) return;
    
    try {
      await authService.updateProfile(profile.userId, data);
      setProfile({ ...profile, ...data });
    } catch (error: any) {
      throw new Error(error.message || 'Profile update failed');
    }
  };

  const value = {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signInWithGithub,
    signInAnonymous,
    signOut,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
