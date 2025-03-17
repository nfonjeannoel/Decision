'use client';

import Link from 'next/link';

const customDecision = {
  id: 'custom',
  title: 'Custom Decision',
  description: 'Create a completely personalized decision framework',
  icon: (
    <svg className="w-16 h-16 text-primary-purple" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
      <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
    </svg>
  ),
};

export default function NewDecision() {
  return (
    <>
      {/* Breadcrumb Navigation */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2">
                <li>
                  <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">Home</Link>
                </li>
                <li>
                  <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                  </svg>
                </li>
                <li>
                  <span className="text-sm font-medium text-primary-indigo">New Decision</span>
                </li>
              </ol>
            </nav>
          </div>
        </div>
      </div>
      
      <div className="bg-gradient-primary py-16 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Start a New Decision
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Create a custom decision framework tailored to your specific needs
          </p>
        </div>
      </div>

      <section className="py-16 px-8 bg-gradient-to-br from-gray-50 to-gray-100 flex-1">
        <div className="max-w-3xl mx-auto">
          <Link 
            href={`/decisions/new/${customDecision.id}`}
            className="glass-card p-12 rounded-xl hover:shadow-xl transition-all duration-300 hover:shadow-glow flex flex-col items-center text-center"
          >
            <div className="mb-8 p-5 rounded-full bg-white/50 backdrop-blur-sm">
              {customDecision.icon}
            </div>
            <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary-purple to-primary-indigo">
              {customDecision.title}
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              {customDecision.description}
            </p>
            
            <div className="mt-6 btn-primary inline-flex items-center py-3 px-6 text-lg">
              Get Started
              <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </Link>
          
          <div className="mt-16 ai-container p-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-ai-glow/20 rounded-full flex items-center justify-center mb-4 shadow-glow">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-8 h-8 text-ai-glow"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-primary-purple mb-4">AI-Powered Decision Making</h3>
              <p className="text-gray-600 max-w-2xl">
                Our advanced AI algorithms will guide you through the decision-making process, 
                helping you identify important factors, evaluate your options, and gain clarity 
                on the best choice for your situation.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
} 