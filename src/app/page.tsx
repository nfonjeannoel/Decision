'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

export default function Home() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [autoScrollActive, setAutoScrollActive] = useState(true);
  const [touchStartX, setTouchStartX] = useState(0);

  // Function to handle scrolling left
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -260, behavior: 'smooth' });
    }
  };

  // Function to handle scrolling right
  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 260, behavior: 'smooth' });
    }
  };

  // Monitor scroll position to show/hide arrows
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      setShowLeftArrow(scrollLeft > 20);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 20);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-scroll carousel functionality
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || !autoScrollActive) return;

    let timeoutId: NodeJS.Timeout;
    let direction = 1; // 1 for right, -1 for left
    let scrollInterval: NodeJS.Timeout;

    const startAutoScroll = () => {
      scrollInterval = setInterval(() => {
        const { scrollLeft, scrollWidth, clientWidth } = container;
        
        // Change direction when reaching the end
        if (scrollLeft >= scrollWidth - clientWidth - 20) {
          direction = -1;
        } else if (scrollLeft <= 20) {
          direction = 1;
        }
        
        container.scrollBy({ left: 2 * direction, behavior: 'auto' });
      }, 50);
    };

    // Start after a delay
    timeoutId = setTimeout(startAutoScroll, 2000);

    // Stop auto-scroll on user interaction
    const stopAutoScroll = () => {
      clearInterval(scrollInterval);
      clearTimeout(timeoutId);
      setAutoScrollActive(false);
    };

    container.addEventListener('mousedown', stopAutoScroll);
    container.addEventListener('touchstart', stopAutoScroll);

    return () => {
      clearInterval(scrollInterval);
      clearTimeout(timeoutId);
      container.removeEventListener('mousedown', stopAutoScroll);
      container.removeEventListener('touchstart', stopAutoScroll);
    };
  }, [autoScrollActive]);

  // Handle touch events for better mobile interaction
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    
    // If it was a significant swipe
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        // Swipe left, scroll right
        scrollRight();
      } else {
        // Swipe right, scroll left
        scrollLeft();
      }
    }
  };

  return (
    <main className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 text-center bg-gradient-primary">
        <div className="w-full max-w-4xl mx-auto glass-card p-5 sm:p-8 md:p-12">
          <div className="mb-5 inline-block p-2 sm:p-3 rounded-xl bg-white/30 backdrop-blur-md">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-8 h-8 sm:w-12 sm:h-12 text-primary-purple"
            >
              <path d="M3.89 15.673L2.313 14.095A1 1 0 012.313 12.68l2.834-2.834a1 1 0 011.414 0l2.834 2.834a1 1 0 010 1.414l-2.834 2.834a1 1 0 01-1.414 0l-1.435-1.435 3.545-3.545L6.343 9.05 3.892 11.5a1 1 0 000 1.414l1.435 1.435-1.436 1.324z" />
              <path d="M21.707 9.05l-2.834 2.834a1 1 0 01-1.414 0l-2.834-2.834a1 1 0 010-1.414l2.834-2.834a1 1 0 011.414 0l1.435 1.435-3.545 3.545 1.414 1.414 3.545-3.545a1 1 0 000-1.414l-1.435-1.435 1.435-1.435z" />
            </svg>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-purple via-primary-indigo to-primary-teal mb-4 sm:mb-6">
            Decidr
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white mb-5 sm:mb-8 font-semibold text-shadow">
            Clarity when it matters most
          </p>
          <p className="text-base sm:text-lg md:text-xl bg-black/30 p-3 sm:p-4 rounded-lg text-white font-medium mb-6 sm:mb-10 max-w-2xl mx-auto">
            Make complex decisions simpler with our AI-powered decision engine that 
            analyzes your preferences, priorities, and constraints.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link 
              href="/decisions/new" 
              className="bg-white text-primary-indigo font-semibold hover:bg-white/90 text-base sm:text-lg px-6 sm:px-8 py-3 rounded-lg transition-all duration-300 hover:shadow-lg w-full sm:w-auto"
            >
              Start a Decision
            </Link>
            <Link 
              href="/how-it-works" 
              className="bg-white text-primary-indigo font-semibold hover:bg-white/90 text-base sm:text-lg px-6 sm:px-8 py-3 rounded-lg transition-all duration-300 hover:shadow-lg w-full sm:w-auto mt-3 sm:mt-0"
            >
              How It Works
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-10 sm:py-16 px-4 sm:px-8 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-3 sm:mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary-purple to-primary-indigo">
            Make Better Decisions
          </h2>
          <p className="text-center text-gray-600 mb-8 sm:mb-12 max-w-3xl mx-auto text-sm sm:text-base">
            Our AI-powered platform guides you through each step of the decision-making process
          </p>
          
          {/* Features cards for mobile (swipeable horizontal scroll) */}
          <div className="md:hidden relative">
            <div 
              className="flex overflow-x-auto pb-4 gap-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4"
              ref={scrollContainerRef}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              style={{ scrollBehavior: 'smooth' }}
            >
              {/* Feature 1 */}
              <div className="glass-card p-5 snap-center min-w-[80%] max-w-[80%] flex-shrink-0 hover:shadow-glow transition-all duration-500 group">
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
                <h3 className="text-lg font-semibold mb-2 text-primary-purple">Identify What Matters</h3>
                <p className="text-gray-600 text-sm">
                  Discover the factors that are most important for your specific decision.
                </p>
              </div>
              
              {/* Feature 2 */}
              <div className="glass-card p-5 snap-center min-w-[80%] max-w-[80%] flex-shrink-0 hover:shadow-glow transition-all duration-500 group">
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
                <h3 className="text-lg font-semibold mb-2 text-primary-indigo">Analyze Options</h3>
                <p className="text-gray-600 text-sm">
                  Compare alternatives side-by-side with smart visualizations and insights.
                </p>
              </div>
              
              {/* Feature 3 */}
              <div className="glass-card p-5 snap-center min-w-[80%] max-w-[80%] flex-shrink-0 hover:shadow-glow transition-all duration-500 group">
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
                <h3 className="text-lg font-semibold mb-2 text-primary-teal">Get Clarity</h3>
                <p className="text-gray-600 text-sm">
                  Receive personalized recommendations with clear explanations.
                </p>
              </div>
            </div>
            
            {/* Scroll indicators */}
            <div className="flex justify-center mt-2 space-x-2">
              <div className="w-2 h-2 rounded-full bg-primary-purple/30"></div>
              <div className="w-2 h-2 rounded-full bg-primary-indigo/30"></div>
              <div className="w-2 h-2 rounded-full bg-primary-teal/30"></div>
            </div>
            
            {/* Navigation arrows */}
            <button 
              onClick={scrollLeft}
              className={`absolute left-0 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-r-lg p-2 shadow-md z-10 transition-opacity duration-300 ${showLeftArrow ? 'opacity-70' : 'opacity-0 pointer-events-none'} hover:opacity-100`}
              aria-label="Scroll left"
            >
              <svg className="w-5 h-5 text-primary-indigo" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              onClick={scrollRight}
              className={`absolute right-0 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-l-lg p-2 shadow-md z-10 transition-opacity duration-300 ${showRightArrow ? 'opacity-70' : 'opacity-0 pointer-events-none'} hover:opacity-100`}
              aria-label="Scroll right"
            >
              <svg className="w-5 h-5 text-primary-indigo" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            
            {/* Scroll hint animation - shows briefly on first load */}
            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-pulse pointer-events-none flex items-center text-xs text-gray-600 opacity-70">
              <span className="mr-1">Swipe</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
          </div>
          
          {/* Feature cards for desktop */}
          <div className="hidden md:grid md:grid-cols-3 gap-8">
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
          <div className="mt-10 sm:mt-16 ai-container p-5 sm:p-8 shadow-glow">
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-ai-glow/20 rounded-full flex items-center justify-center mb-4 shadow-glow">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-7 h-7 sm:w-8 sm:h-8 text-ai-glow"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-primary-purple mb-3 sm:mb-4">AI-Powered Decision Making</h3>
              <p className="text-gray-600 text-center max-w-2xl text-sm sm:text-base">
                Our advanced AI algorithms analyze your preferences and help you make the best decision. Experience the magic of AI-enhanced clarity.
              </p>
              
              {/* Rating system demonstration */}
              <div className="mt-6 sm:mt-8 w-full max-w-lg">
                <div className="flex justify-between text-xs sm:text-sm text-gray-600 mb-2">
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
          
          {/* CTA Button */}
          <div className="flex justify-center mt-8 sm:mt-12">
            <Link 
              href="/decisions/new" 
              className="bg-primary-indigo text-white font-semibold hover:bg-primary-indigo/90 text-base sm:text-lg px-6 sm:px-8 py-3 rounded-lg transition-all duration-300 hover:shadow-lg"
            >
              Start Making Better Decisions
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
} 