'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { supabase } from '@/lib/supabaseClient';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoading, session } = useAuth();
  const router = useRouter();
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    const checkSession = async () => {
      try {
        if (!isMounted) return;
        setIsCheckingSession(true);
        
        // If user is already set in context, we're authenticated
        if (user && session) {
          console.log("User already authenticated in context");
          setIsCheckingSession(false);
          return;
        }
        
        // Check for session directly with Supabase
        const { data: { session: supabaseSession } } = await supabase.auth.getSession();
        
        if (supabaseSession) {
          console.log("Valid session found in Supabase, session will be restored");
          // The AuthContext will pick up this session via onAuthStateChange
          setIsCheckingSession(false);
          return;
        }
        
        // No authentication found - redirect to login
        console.log("No authentication found, redirecting to login");
        router.push('/login');
      } catch (error) {
        console.error("Error checking authentication:", error);
        if (isMounted) {
          router.push('/login');
        }
      } finally {
        if (isMounted) {
          setIsCheckingSession(false);
        }
      }
    };

    if (!isLoading) {
      checkSession();
    }
    
    return () => {
      isMounted = false;
    };
  }, [user, isLoading, router, session]);

  // Show loading while checking authentication
  if (isLoading || isCheckingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If authenticated, render children
  return <>{children}</>;
} 