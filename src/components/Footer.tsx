import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-50 to-gray-100 border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
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
        
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-400 text-center">
            &copy; {new Date().getFullYear()} Decidr. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
} 