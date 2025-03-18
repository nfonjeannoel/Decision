'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useNotification } from '@/components/NotificationContext';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const { resetPassword } = useAuth();
  const { showNotification } = useNotification();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { error, success } = await resetPassword(email);

      if (error) {
        throw error;
      }

      if (success) {
        setIsSuccess(true);
        showNotification('Password reset email sent', 'success');
      }
    } catch (error) {
      console.error('Password reset error:', error);
      setError((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Decidr</h1>
          <p className="text-slate-600">Reset your password</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-8">
          {isSuccess ? (
            <div className="text-center">
              <svg className="mx-auto h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <h2 className="mt-4 text-lg font-medium text-gray-900">Check your email</h2>
              <p className="mt-2 text-sm text-gray-600">
                We've sent a password reset link to <span className="font-medium">{email}</span>.
                Please check your inbox and follow the instructions.
              </p>
              {process.env.NODE_ENV === 'development' && (
                <div className="mt-4 p-3 bg-gray-50 text-gray-700 text-xs rounded-md text-left">
                  <p className="font-bold mb-1">Local Development Notes:</p>
                  <p>In local development, emails may not be sent to your actual inbox.</p>
                  <p>Check Supabase's Inbucket at <a href="http://localhost:54324" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">http://localhost:54324</a></p>
                  <p className="mt-2">If you're using local Supabase, you'll need to make sure:</p>
                  <ol className="list-decimal ml-4 mt-1 space-y-1">
                    <li>Site URL in Supabase project settings is set to your local URL (e.g., http://localhost:3000)</li>
                    <li>Redirect URLs include your reset password path (e.g., http://localhost:3000/reset-password)</li>
                  </ol>
                </div>
              )}
              <div className="mt-6">
                <Link href="/login" className="text-blue-600 hover:underline">
                  Return to login
                </Link>
              </div>
            </div>
          ) : (
            <div>
              {error && (
                <div className="mb-4 bg-red-50 text-red-700 p-3 rounded-md text-sm">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
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
                  <p className="mt-1 text-xs text-gray-500">
                    Enter the email address associated with your account
                  </p>
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
                        Sending...
                      </span>
                    ) : (
                      'Send Reset Link'
                    )}
                  </button>
                </div>
              </form>
              
              <div className="mt-6 text-center text-sm">
                <p className="text-gray-600">
                  Remember your password?{' '}
                  <Link href="/login" className="text-blue-600 hover:underline">
                    Log in
                  </Link>
                </p>
              </div>
            </div>
          )}
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