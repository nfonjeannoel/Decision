'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useNotification } from '@/components/NotificationContext';

// Component that uses useSearchParams, wrapped in Suspense in the main component
function ResetPasswordContent() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');
  const [tokenFromUrl, setTokenFromUrl] = useState<string | null>(null);
  const [manualToken, setManualToken] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showNotification } = useNotification();
  const supabase = createClientComponentClient();

  // Listen for auth state changes including PASSWORD_RECOVERY
  useEffect(() => {
    // Show initial loading message
    setDebugInfo(`Initializing password reset page...\nURL parameters: token=${searchParams.get('token')}, type=${searchParams.get('type')}\nFull URL: ${window.location.href}`);
    
    // Check URL parameters (token could be either in direct URL params or in a hash fragment)
    const token = searchParams.get('token');
    const type = searchParams.get('type');
    const fullUrl = window.location.href;
    
    // Special user-friendly message if we detect hash fragment
    if (fullUrl.includes('#access_token=')) {
      showNotification('Processing your reset token...', 'info');
    }

    // Try to extract token from hash fragment if it exists in the URL
    // This happens when Supabase redirects with a hash containing the token
    if (fullUrl.includes('#')) {
      try {
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const hashToken = hashParams.get('access_token');
        const hashType = hashParams.get('type');
        
        if (hashToken) {
          setDebugInfo(prev => `${prev}\nFound token in hash fragment: ${hashToken.substring(0, 10)}...`);
          
          // If we have a hash token, use it to set the session
          const setSession = async () => {
            try {
              // Set the session using the access_token from the hash
              const { error } = await supabase.auth.setSession({
                access_token: hashToken,
                refresh_token: hashParams.get('refresh_token') || '',
              });
              
              if (error) {
                console.error("Error setting session from hash token:", error);
                setDebugInfo(prev => `${prev}\nError setting session: ${error.message}`);
              } else {
                setDebugInfo(prev => `${prev}\nSession established from hash token`);
                setIsRecoveryMode(true);
              }
            } catch (err) {
              console.error("Exception setting session:", err);
              setDebugInfo(prev => `${prev}\nException setting session: ${(err as Error).message}`);
            }
          };
          
          setSession();
          setTokenFromUrl(hashToken);
        }
      } catch (e) {
        console.error("Error parsing hash params:", e);
        setDebugInfo(prev => `${prev}\nError parsing hash fragment: ${e}`);
      }
    }
    
    // Also check direct URL params (this is the expected pattern for the token in your link)
    if (token && type === 'recovery') {
      setDebugInfo(prev => `${prev}\nFound recovery token in URL params: ${token.substring(0, 10)}...`);
      setTokenFromUrl(token);
      setIsRecoveryMode(true);
    }

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth event:', event, session ? 'Session exists' : 'No session');
      setDebugInfo(prev => `${prev}\nAuth event: ${event}, Session: ${session ? 'exists' : 'none'}`);
      
      if (event === 'PASSWORD_RECOVERY') {
        // User has arrived with a valid recovery token
        setIsRecoveryMode(true);
        setDebugInfo(prev => `${prev}\nPASSWORD_RECOVERY event detected`);
      } else if (session) {
        // If we have a session but not from password recovery,
        // we might have gotten here from a recovery link that didn't trigger the event
        setIsRecoveryMode(true);
        setDebugInfo(prev => `${prev}\nSession exists but no PASSWORD_RECOVERY event`);
      }
    });

    // Check current session on mount
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      setDebugInfo(prev => `${prev}\ngetSession result: ${data.session ? 'Session exists' : 'No session'}`);
      
      if (data.session) {
        setIsRecoveryMode(true);
      }
    };
    
    checkSession();

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [searchParams, supabase.auth, showNotification]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      setIsLoading(false);
      return;
    }

    try {
      // If we have a token from URL but no active session, we need to verify the token first
      if (tokenFromUrl && !isRecoveryMode) {
        setDebugInfo(prev => `${prev}\nAttempting to verify token manually: ${tokenFromUrl.substring(0, 10)}...`);
        
        try {
          // First, try to set session if this is a JWT token (from hash fragment)
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: tokenFromUrl,
            refresh_token: '',
          });
          
          if (sessionError) {
            // If it's not a JWT token, try to verify it as an OTP token
            setDebugInfo(prev => `${prev}\nFailed to use token as JWT, trying as OTP...`);
            const { error: verifyError } = await supabase.auth.verifyOtp({
              token_hash: tokenFromUrl,
              type: 'recovery',
            });
            
            if (verifyError) {
              throw new Error(`Token verification failed: ${verifyError.message}`);
            }
          }
          
          setDebugInfo(prev => `${prev}\nToken verification successful`);
        } catch (tokenError) {
          throw new Error(`Could not authenticate with the provided token: ${(tokenError as Error).message}`);
        }
      }
      
      // Get the current session to check if we're authenticated
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (!sessionData.session) {
        throw new Error('No authenticated session. Please try the password reset process again.');
      }
      
      // Now update the user's password
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        throw error;
      }

      showNotification('Password reset successful', 'success');
      
      // Wait briefly before redirecting
      setTimeout(() => {
        router.push('/login');
      }, 1000);
    } catch (error) {
      console.error('Password reset error:', error);
      setError((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleManualTokenSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Try to verify the manually entered token
      const { error } = await supabase.auth.verifyOtp({
        token_hash: manualToken.trim(),
        type: 'recovery',
      });
      
      if (error) {
        throw error;
      }
      
      setIsRecoveryMode(true);
      setTokenFromUrl(manualToken.trim());
      setDebugInfo(prev => `${prev}\nManual token verification successful`);
    } catch (error) {
      console.error('Manual token verification error:', error);
      setError(`Invalid token: ${(error as Error).message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Decidr</h1>
          <p className="text-slate-600">Set new password</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-8">
          {error && (
            <div className="mb-4 bg-red-50 text-red-700 p-3 rounded-md text-sm">
              {error}
            </div>
          )}
          
          {process.env.NODE_ENV === 'development' && debugInfo && (
            <div className="mb-4 bg-gray-50 text-gray-700 p-3 rounded-md text-xs font-mono whitespace-pre-wrap">
              <div className="font-bold mb-1">Debug Info (only visible in development):</div>
              {debugInfo}
            </div>
          )}
          
          {/* If no token or session is found, show token entry form */}
          {!isRecoveryMode && !tokenFromUrl ? (
            <div>
              <h3 className="text-lg font-medium mb-4">Recovery Link Issue</h3>
              <p className="mb-4 text-sm text-gray-600">
                Your recovery link appears to be missing the necessary token. You can:
              </p>
              <ul className="list-disc ml-5 mb-4 text-sm text-gray-600">
                <li>Request a new password reset link</li>
                <li>Try entering the token manually from your reset link</li>
              </ul>
              
              <div className="mt-4 border-t pt-4">
                <p className="text-sm font-medium mb-2">Enter token manually:</p>
                <form onSubmit={handleManualTokenSubmit} className="space-y-4">
                  <div>
                    <input 
                      type="text"
                      value={manualToken}
                      onChange={(e) => setManualToken(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Paste the token from your reset link"
                    />
                    <p className="mt-1 text-xs text-gray-500">Token is the long string after "token=" in your reset link</p>
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading || !manualToken}
                    className={`w-full py-2 px-4 rounded-md font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      isLoading || !manualToken ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    Verify Token
                  </button>
                </form>
                
                <div className="mt-4 text-center">
                  <Link href="/forgot-password" className="text-blue-600 hover:underline text-sm">
                    Request a new password reset
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter new password"
                  required
                />
                <p className="mt-1 text-xs text-gray-500">Must be at least 8 characters</p>
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Confirm new password"
                  required
                />
              </div>
              
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-3 px-4 rounded-md font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    isLoading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating...
                    </span>
                  ) : (
                    'Reset Password'
                  )}
                </button>
              </div>
            </form>
          )}
          
          <div className="mt-6 text-center text-sm">
            <p className="text-gray-600">
              Remember your password?{' '}
              <Link href="/login" className="text-blue-600 hover:underline">
                Log in
              </Link>
            </p>
          </div>
        </div>
        
        <div className="text-center mt-8">
          <Link href="/" className="text-sm text-slate-600 hover:underline">
            &larr; Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

// Main component with Suspense boundary for useSearchParams
export default function ResetPassword() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col justify-center items-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-slate-800 mb-2">Decidr</h1>
            <p className="text-slate-600">Loading reset password...</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-8 flex justify-center">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
          </div>
        </div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
} 