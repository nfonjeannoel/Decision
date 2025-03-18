'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

// Define the context type
type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signUp: (email: string, password: string) => Promise<{
    error: any | null;
    success: boolean;
  }>;
  signIn: (email: string, password: string) => Promise<{
    error: any | null;
    success: boolean;
  }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{
    error: any | null;
    success: boolean;
  }>;
};

// Create the context with a default value
export const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
  signUp: async () => ({ error: null, success: false }),
  signIn: async () => ({ error: null, success: false }),
  signOut: async () => {},
  resetPassword: async () => ({ error: null, success: false }),
});

// Create a provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get the current session and user on mount
    const getInitialSession = async () => {
      try {
        setIsLoading(true);
        
        // Get the initial session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          setSession(session);
          setUser(session.user);
          console.log("Initial session restored");
        }
        
        // Set up auth state change listener to keep session in sync
        const { data: { subscription } } = await supabase.auth.onAuthStateChange(
          (event, session) => {
            console.log("Auth state changed:", event);
            setSession(session);
            setUser(session?.user ?? null);
          }
        );

        return () => {
          subscription.unsubscribe();
        };
      } finally {
        setIsLoading(false);
      }
    };

    getInitialSession();
  }, []);

  // Sign up function
  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) {
        return { error, success: false };
      }
      
      return { error: null, success: true };
    } catch (error) {
      return { error, success: false };
    }
  };

  // Sign in function
  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        return { error, success: false };
      }
      
      // Explicitly update the context state with the new session
      if (data.session) {
        setSession(data.session);
        setUser(data.user);
      }
      
      return { error: null, success: true };
    } catch (error) {
      return { error, success: false };
    } finally {
      setIsLoading(false);
    }
  };

  // Sign out function
  const signOut = async () => {
    await supabase.auth.signOut();
    // Clear context state
    setUser(null);
    setSession(null);
    router.push('/login');
  };

  // Password reset function
  const resetPassword = async (email: string) => {
    try {
      console.log("Sending password reset email to:", email);
      console.log("Redirect URL:", `${window.location.origin}/reset-password`);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        console.error("Password reset error:", error);
        return { error, success: false };
      }
      
      console.log("Password reset email sent successfully");
      
      // For local development, provide a console message about checking the email
      if (process.env.NODE_ENV === 'development') {
        console.log("DEVELOPMENT MODE: Check Supabase Inbucket at http://localhost:54324 for the reset email");
      }
      
      return { error: null, success: true };
    } catch (error) {
      console.error("Unexpected password reset error:", error);
      return { error, success: false };
    }
  };

  const value = {
    user,
    session,
    isLoading,
    signUp,
    signIn,
    signOut,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook for using the auth context
export const useAuth = () => useContext(AuthContext); 