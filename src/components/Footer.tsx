import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-50 to-gray-100 border-t border-gray-200 safe-bottom pb-16 sm:pb-0">
      <div className="max-w-7xl mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        {/* Mobile Footer */}
        <div className="md:hidden">
          <div className="flex justify-center items-center mb-6">
            <svg 
              className="w-7 h-7 text-primary-purple mr-2" 
              fill="currentColor" 
              viewBox="0 0 20 20" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M3.89 15.673L2.313 14.095A1 1 0 012.313 12.68l2.834-2.834a1 1 0 011.414 0l2.834 2.834a1 1 0 010 1.414l-2.834 2.834a1 1 0 01-1.414 0l-1.435-1.435 3.545-3.545L6.343 9.05 3.892 11.5a1 1 0 000 1.414l1.435 1.435-1.436 1.324z" />
              <path d="M21.707 9.05l-2.834 2.834a1 1 0 01-1.414 0l-2.834-2.834a1 1 0 010-1.414l2.834-2.834a1 1 0 011.414 0l1.435 1.435-3.545 3.545 1.414 1.414 3.545-3.545a1 1 0 000-1.414l-1.435-1.435 1.435-1.435z" />
            </svg>
            <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-primary-purple to-primary-indigo">Decidr</span>
          </div>
          
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-500 tracking-wider uppercase mb-2">Navigation</h3>
              <ul className="space-y-1.5">
                <li>
                  <Link href="/" className="text-sm text-gray-600 hover:text-primary-indigo">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="text-sm text-gray-600 hover:text-primary-indigo">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/decisions/new" className="text-sm text-gray-600 hover:text-primary-indigo">
                    New Decision
                  </Link>
                </li>
                <li>
                  <Link href="/how-it-works" className="text-sm text-gray-600 hover:text-primary-indigo">
                    How It Works
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-500 tracking-wider uppercase mb-2">Support</h3>
              <ul className="space-y-1.5">
                <li>
                  <Link href="/decisions/new/custom" className="text-sm text-gray-600 hover:text-primary-indigo">
                    Custom Decision
                  </Link>
                </li>
                <li>
                  <Link href="/how-it-works" className="text-sm text-gray-600 hover:text-primary-indigo">
                    Help & Documentation
                  </Link>
                </li>
                <li>
                  <Link href="/" className="text-sm text-gray-600 hover:text-primary-indigo">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Desktop Footer */}
        <div className="hidden md:grid md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center">
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
            </div>
            <p className="mt-4 text-sm text-gray-600">
              Make better decisions with AI-powered guidance and clarity when it matters most.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-500 tracking-wider uppercase">Navigation</h3>
            <ul role="list" className="mt-4 space-y-2">
              <li>
                <Link href="/" className="text-base text-gray-600 hover:text-primary-indigo">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-base text-gray-600 hover:text-primary-indigo">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/decisions/new" className="text-base text-gray-600 hover:text-primary-indigo">
                  New Decision
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-base text-gray-600 hover:text-primary-indigo">
                  How It Works
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-500 tracking-wider uppercase">Decision Types</h3>
            <ul role="list" className="mt-4 space-y-2">
              <li>
                <Link href="/decisions/new/custom" className="text-base text-gray-600 hover:text-primary-indigo">
                  Custom Decision
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-500 tracking-wider uppercase">Support</h3>
            <ul role="list" className="mt-4 space-y-2">
              <li>
                <Link href="/how-it-works" className="text-base text-gray-600 hover:text-primary-indigo">
                  Help & Documentation
                </Link>
              </li>
              <li>
                <Link href="/" className="text-base text-gray-600 hover:text-primary-indigo">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-200">
          <p className="text-xs sm:text-sm text-gray-400 text-center">
            &copy; {new Date().getFullYear()} Decidr. All rights reserved.
          </p>
        </div>
      </div>
      
      {/* Mobile bottom navigation */}
      <div className="md:hidden mobile-bottom-nav flex justify-around items-center safe-bottom">
        <Link href="/" className="touch-button p-2 flex flex-col items-center text-xs">
          <svg className="w-6 h-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span>Home</span>
        </Link>
        <Link href="/dashboard" className="touch-button p-2 flex flex-col items-center text-xs">
          <svg className="w-6 h-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <span>Dashboard</span>
        </Link>
        <Link href="/decisions/new" className="touch-button p-2 flex flex-col items-center text-xs">
          <svg className="w-6 h-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>New</span>
        </Link>
        <Link href="/how-it-works" className="touch-button p-2 flex flex-col items-center text-xs">
          <svg className="w-6 h-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Help</span>
        </Link>
      </div>
    </footer>
  );
} 