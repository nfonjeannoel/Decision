'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useNotification } from '@/components/NotificationContext';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasPendingDecision, setHasPendingDecision] = useState(false);
  const [fromDecisionPage, setFromDecisionPage] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { signUp, signIn } = useAuth();
  const { showNotification } = useNotification();
  const supabase = createClientComponentClient();
  
  // Check for pending decisions in localStorage
  useEffect(() => {
    try {
      // Check if there's a pending decision
      const pendingDecisionJson = localStorage.getItem('pendingDecision');
      
      if (pendingDecisionJson) {
        try {
          // Just set state to show the message, don't attempt to clear the decision
          setHasPendingDecision(true);
          
          // Check if user came from decision page
          const referrer = localStorage.getItem('pendingDecisionReferrer') === 'true';
          setFromDecisionPage(referrer);
          
          // Only show the message if they came from the decision page
          if (!referrer) {
            setHasPendingDecision(false);
          }
        } catch (error) {
          console.error('Error parsing pending decision:', error);
        }
      }
    } catch (error) {
      console.error('Error checking localStorage:', error);
    }
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');

    // Form validation
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
      // Use context's signUp function
      const { error, success } = await signUp(email, password);

      if (error) {
        throw error;
      }

      // We also need to update profile information
      if (success) {
        // Update user metadata with full name
        try {
          // Use supabase directly for this part since the context doesn't have a method for it
          await supabase.auth.updateUser({
            data: { full_name: fullName },
          });
          
          // Now sign in with the new credentials
          const signInResult = await signIn(email, password);
          
          if (signInResult.error) {
            throw signInResult.error;
          }
          
          showNotification('Account created successfully', 'success');
          
          // Wait briefly to ensure context is updated before navigation
          setTimeout(() => {
            router.push('/dashboard');
          }, 100);
        } catch (updateError) {
          console.error('Error updating user profile:', updateError);
          showNotification('Account created, but there was an error updating your profile.', 'warning');
          router.push('/dashboard');
        }
      }
    } catch (error) {
      console.error('Signup error:', error);
      // Format user-friendly error message
      if ((error as Error).message.includes('email already registered')) {
        setError('This email is already registered. Please use a different email or login instead.');
      } else {
        setError((error as Error).message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Decidr</h1>
          <p className="text-slate-600">Create your account</p>
          {hasPendingDecision && fromDecisionPage && (
            <div className="mt-2 text-sm bg-indigo-50 text-indigo-700 p-2 rounded-md">
              Your decision will be saved after registration.
            </div>
          )}
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-8">
          {error && (
            <div className="mb-4 bg-red-50 text-red-700 p-3 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
                required
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Create a password"
                required
              />
              <p className="mt-1 text-xs text-gray-500">Must be at least 8 characters</p>
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Confirm your password"
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
                    Creating account...
                  </span>
                ) : (
                  hasPendingDecision && fromDecisionPage ? 'Sign Up & Save Decision' : 'Sign Up'
                )}
              </button>
            </div>
          </form>
          
          <div className="mt-6 text-center text-sm">
            <p className="text-gray-600">
              Already have an account?{' '}
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