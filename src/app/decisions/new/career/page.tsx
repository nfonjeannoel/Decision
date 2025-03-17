'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useNotification } from '@/components/NotificationContext';

export default function CareerDecisionRedirect() {
  const router = useRouter();
  const { showNotification } = useNotification();
  
  useEffect(() => {
    showNotification('Please use our custom decision template instead.', 'info');
    router.push('/decisions/new/custom');
  }, [router, showNotification]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="glass-card p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <h2 className="text-2xl font-semibold mb-2">Redirecting</h2>
        <p className="text-gray-600">Taking you to the custom decision template...</p>
      </div>
    </div>
  );
} 