'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-gradient-primary">
        <div className="max-w-4xl mx-auto glass-card p-8 md:p-12">
          <div className="mb-6 inline-block p-3 rounded-xl bg-white/30 backdrop-blur-md">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-12 h-12 text-primary-purple"
            >
              <path d="M3.89 15.673L2.313 14.095A1 1 0 012.313 12.68l2.834-2.834a1 1 0 011.414 0l2.834 2.834a1 1 0 010 1.414l-2.834 2.834a1 1 0 01-1.414 0l-1.435-1.435 3.545-3.545L6.343 9.05 3.892 11.5a1 1 0 000 1.414l1.435 1.435-1.436 1.324z" />
              <path d="M21.707 9.05l-2.834 2.834a1 1 0 01-1.414 0l-2.834-2.834a1 1 0 010-1.414l2.834-2.834a1 1 0 011.414 0l1.435 1.435-3.545 3.545 1.414 1.414 3.545-3.545a1 1 0 000-1.414l-1.435-1.435 1.435-1.435z" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-purple via-primary-indigo to-primary-teal mb-6">
            Decidr
          </h1>
          <p className="text-xl md:text-2xl text-white mb-8">
            Clarity when it matters most
          </p>
          <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            Make complex decisions simpler with our AI-powered decision engine that 
            analyzes your preferences, priorities, and constraints to provide personalized recommendations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/decisions/new" 
              className="bg-white text-primary-indigo font-semibold hover:bg-white/90 text-lg px-8 py-3 rounded-lg transition-all duration-300 hover:shadow-lg"
            >
              Start a Decision
            </Link>
            <Link 
              href="/how-it-works" 
              className="bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:bg-white/30 text-lg px-8 py-3 rounded-lg transition-all duration-300"
            >
              How It Works
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-8 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary-purple to-primary-indigo">
            Make Better Decisions
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">Our AI-powered platform guides you through each step of the decision-making process</p>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="glass-card p-6 hover:shadow-glow transition-all duration-500 group">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-purple to-primary-indigo rounded-full flex items-center justify-center mb-4 group-hover:shadow-glow transition-all duration-500">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6 text-white"
                >
                  <path d="M14 10H2v2h12v-2zm0-4H2v2h12V6zm4 8v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM2 16h8v-2H2v2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-primary-purple">Identify What Matters</h3>
              <p className="text-gray-600">
                Discover the factors that are most important for your specific decision.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="glass-card p-6 hover:shadow-glow transition-all duration-500 group">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-indigo to-primary-teal rounded-full flex items-center justify-center mb-4 group-hover:shadow-glow transition-all duration-500">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6 text-white"
                >
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z" />
                  <path d="M7 12h2v5H7zm4-7h2v12h-2zm4 4h2v8h-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-primary-indigo">Analyze Options</h3>
              <p className="text-gray-600">
                Compare alternatives side-by-side with smart visualizations and insights.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="glass-card p-6 hover:shadow-glow transition-all duration-500 group">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-teal to-secondary rounded-full flex items-center justify-center mb-4 group-hover:shadow-glow transition-all duration-500">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6 text-white"
                >
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-primary-teal">Get Clarity</h3>
              <p className="text-gray-600">
                Receive personalized recommendations with clear explanations.
              </p>
            </div>
          </div>
          
          {/* AI section with glow effect */}
          <div className="mt-16 ai-container p-8 shadow-glow">
            <div className="flex flex-col items-center">
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
              <p className="text-gray-600 text-center max-w-2xl">
                Our advanced AI algorithms analyze your preferences and help you make the best decision. Experience the magic of AI-enhanced clarity.
              </p>
              
              {/* Rating system demonstration */}
              <div className="mt-8 w-full max-w-lg">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Poor</span>
                  <span>Fair</span>
                  <span>Good</span>
                  <span>Great</span>
                  <span>Excellent</span>
                </div>
                <div className="grid grid-cols-5 gap-1">
                  <div className="rating-indicator rating-poor"></div>
                  <div className="rating-indicator rating-fair"></div>
                  <div className="rating-indicator rating-good"></div>
                  <div className="rating-indicator rating-great"></div>
                  <div className="rating-indicator rating-excellent"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
} 