'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(path + '/');
  };

  const navItems = [
    { name: 'Home', path: '/', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { name: 'Dashboard', path: '/dashboard', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { name: 'New Decision', path: '/decisions/new', icon: 'M12 6v6m0 0v6m0-6h6m-6 0H6' },
    { name: 'How It Works', path: '/how-it-works', icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  ];

  const handleSignOut = async () => {
    await signOut();
    window.location.href = '/';
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isMenuOpen && !target.closest('.mobile-menu-container') && !target.closest('.mobile-menu-button')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 shadow-md backdrop-blur-sm' : 'bg-white/80 backdrop-blur-sm'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center">
                <svg 
                  className="w-8 h-8 text-primary-purple mr-2" 
                  fill="currentColor" 
                  viewBox="0 0 20 20" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M3.89 15.673L2.313 14.095A1 1 0 012.313 12.68l2.834-2.834a1 1 0 011.414 0l2.834 2.834a1 1 0 010 1.414l-2.834 2.834a1 1 0 01-1.414 0l-1.435-1.435 3.545-3.545L6.343 9.05 3.892 11.5a1 1 0 000 1.414l1.435 1.435-1.436 1.324z" />
                  <path d="M21.707 9.05l-2.834 2.834a1 1 0 01-1.414 0l-2.834-2.834a1 1 0 010-1.414l2.834-2.834a1 1 0 011.414 0l1.435 1.435-3.545 3.545 1.414 1.414 3.545-3.545a1 1 0 000-1.414l-1.435-1.435 1.435-1.435z" />
                </svg>
                <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-primary-purple to-primary-indigo">Decidr</span>
              </Link>
            </div>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    isActive(item.path)
                      ? 'border-primary-indigo text-primary-indigo'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
            {user ? (
              <div className="flex items-center">
                <div className="mr-3 flex items-center">
                  <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                    {user.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="ml-2 text-sm text-gray-700 hidden md:inline">{user.email}</span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign in
              </Link>
            )}
            <Link
              href="/dashboard"
              className="p-2 rounded-full text-gray-400 hover:text-primary-indigo focus:outline-none transition-colors"
            >
              <span className="sr-only">View dashboard</span>
              <svg 
                className="h-6 w-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" 
                />
              </svg>
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="mobile-menu-button inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-primary-indigo hover:bg-gray-100 focus:outline-none transition-colors"
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu overlay */}
      <div 
        className={`${isMenuOpen ? 'opacity-50 pointer-events-auto' : 'opacity-0 pointer-events-none'} fixed inset-0 bg-black transition-opacity duration-300 ease-in-out z-40 sm:hidden`}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* Mobile menu slide-out drawer */}
      <div 
        className={`mobile-menu-container fixed top-0 right-0 w-4/5 max-w-xs h-full bg-white shadow-lg transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out z-50 sm:hidden overflow-y-auto`}
        style={{ height: '100vh', maxHeight: '100vh' }}
      >
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center">
            <svg 
              className="w-7 h-7 text-primary-purple mr-2" 
              fill="currentColor" 
              viewBox="0 0 20 20" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M3.89 15.673L2.313 14.095A1 1 0 012.313 12.68l2.834-2.834a1 1 0 011.414 0l2.834 2.834a1 1 0 010 1.414l-2.834 2.834a1 1 0 01-1.414 0l-1.435-1.435 3.545-3.545L6.343 9.05 3.892 11.5a1 1 0 000 1.414l1.435 1.435-1.436 1.324z" />
              <path d="M21.707 9.05l-2.834 2.834a1 1 0 01-1.414 0l-2.834-2.834a1 1 0 010-1.414l2.834-2.834a1 1 0 011.414 0l1.435 1.435-3.545 3.545 1.414 1.414 3.545-3.545a1 1 0 000-1.414l-1.435-1.435 1.435-1.435z" />
            </svg>
            <span className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-primary-purple to-primary-indigo">Decidr</span>
          </div>
          <button
            onClick={() => setIsMenuOpen(false)}
            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
          >
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        
        {/* User profile section (if logged in) */}
        {user && (
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                {user.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700 truncate max-w-[200px]">{user.email}</p>
                <button
                  onClick={handleSignOut}
                  className="mt-1 text-xs text-primary-indigo font-medium"
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Navigation links */}
        <div className="p-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center px-4 py-3 rounded-lg text-base font-medium ${
                isActive(item.path)
                  ? 'bg-primary-indigo/10 text-primary-indigo'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-primary-indigo'
              } transition-colors`}
              onClick={() => setIsMenuOpen(false)}
            >
              <svg 
                className={`mr-3 h-5 w-5 ${isActive(item.path) ? 'text-primary-indigo' : 'text-gray-400'}`}
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
              </svg>
              {item.name}
            </Link>
          ))}
          
          {/* Sign in link (if not logged in) */}
          {!user && (
            <div className="mt-2 px-4">
              <Link
                href="/login"
                className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign in
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
} 