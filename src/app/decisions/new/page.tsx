'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Suggestion cloud data with common decision types
const decisionSuggestions: Suggestion[] = [
  { id: 1, text: 'Career Change', size: 'large' },
  { id: 2, text: 'Home Purchase', size: 'medium' },
  { id: 3, text: 'Job Offer', size: 'large' },
  { id: 4, text: 'Investment Option', size: 'medium' },
  { id: 5, text: 'Education Path', size: 'large' },
  { id: 6, text: 'Vacation Planning', size: 'small' },
  { id: 7, text: 'Business Strategy', size: 'medium' },
  { id: 8, text: 'Technology Adoption', size: 'small' },
  { id: 9, text: 'Vehicle Purchase', size: 'medium' },
  { id: 10, text: 'Relocation', size: 'large' },
  { id: 11, text: 'Wedding Planning', size: 'small' },
  { id: 12, text: 'Medical Treatment', size: 'medium' },
  { id: 13, text: 'Software Selection', size: 'small' },
  { id: 14, text: 'Hiring Decision', size: 'medium' },
  { id: 15, text: 'Retirement Planning', size: 'medium' },
];

const customDecision = {
  id: 'custom',
  title: 'Custom Decision',
  description: 'Create a completely personalized decision framework',
  icon: (
    <svg className="w-12 h-12 sm:w-16 sm:h-16 text-primary-purple" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
      <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
    </svg>
  ),
};

// Tag cloud component that animates and allows selection
// Define proper types for the component props
interface Suggestion {
  id: number;
  text: string;
  size: 'small' | 'medium' | 'large';
}

interface Position {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface TagCloudProps {
  suggestions: Suggestion[];
  onSelect: (text: string) => void;
}

const ModernSuggestionCloud = ({ suggestions, onSelect }: TagCloudProps) => {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  
  return (
    <div className="w-full mb-4 mt-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
        {suggestions.map((suggestion) => {
          const isHovered = hoveredId === suggestion.id;
          let bgColor = "from-indigo-50 to-purple-50";
          let textColor = "text-slate-700";
          
          // Assign different gradient colors based on suggestion size
          if (suggestion.size === 'large') {
            bgColor = "from-indigo-50 to-purple-100";
          } else if (suggestion.size === 'medium') {
            bgColor = "from-blue-50 to-indigo-100";
          } else {
            bgColor = "from-violet-50 to-indigo-50";
          }
          
          return (
            <button
              key={suggestion.id}
              className={`relative rounded-xl p-3 sm:p-4 transition-all duration-300 flex items-center justify-center shadow-sm
                         ${isHovered ? 'shadow-md transform scale-105' : 'hover:shadow-md hover:scale-102'}
                         bg-gradient-to-br ${bgColor} overflow-hidden
                         aspect-[4/3] border border-white/50`}
              onClick={() => onSelect(suggestion.text)}
              onMouseEnter={() => setHoveredId(suggestion.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Background pattern for visual interest */}
              <div className="absolute top-0 right-0 w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-white/30 -translate-y-4 translate-x-4 sm:-translate-y-6 sm:translate-x-6"></div>
              <div className="absolute bottom-0 left-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white/30 translate-y-3 -translate-x-3 sm:translate-y-4 sm:-translate-x-4"></div>
              
              {/* Text content */}
              <span className={`font-medium ${textColor} text-center text-sm sm:text-base`}>
                {suggestion.text}
              </span>
              
              {/* Subtle hover indicator */}
              <div className={`absolute bottom-2 h-1 rounded-full bg-indigo-400 left-1/2 transform -translate-x-1/2 transition-all duration-300 ${isHovered ? 'w-8 sm:w-10 opacity-100' : 'w-4 sm:w-5 opacity-0'}`}></div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default function NewDecision() {
  const router = useRouter();
  
  // Handle selection of a suggestion
  const handleSuggestionSelect = (suggestion: string) => {
    // Store the selection in local storage for the next page to use
    localStorage.setItem('decisionSuggestion', suggestion);
    // Navigate to the custom decision page
    router.push('/decisions/new/custom');
  };
  
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
      
      <div className="bg-gradient-primary py-10 sm:py-16 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6">
            Start a New Decision
          </h1>
          <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto">
            Create a custom decision framework tailored to your specific needs
          </p>
        </div>
      </div>

      <section className="py-8 sm:py-16 px-4 sm:px-8 bg-gradient-to-br from-gray-50 to-gray-100 flex-1">
        <div className="max-w-4xl mx-auto">
          {/* Custom Decision - Primary Option */}
          <Link 
            href={`/decisions/new/${customDecision.id}`}
            className="glass-card p-6 sm:p-12 rounded-xl hover:shadow-xl transition-all duration-300 hover:shadow-glow flex flex-col items-center text-center"
          >
            <div className="mb-6 sm:mb-8 p-4 sm:p-5 rounded-full bg-white/50 backdrop-blur-sm">
              {customDecision.icon}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary-purple to-primary-indigo">
              {customDecision.title}
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8">
              {customDecision.description}
            </p>
            
            <div className="mt-2 sm:mt-6 btn-primary inline-flex items-center py-3 px-6 text-base sm:text-lg">
              Get Started
              <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </Link>
          
          {/* Inspiration section with modern card-based cloud moved below */}
          <div className="mt-8 sm:mt-12">
            <div className="glass-card p-5 sm:p-8 rounded-xl shadow-md">
              <div className="text-center mb-4 sm:mb-5">
                <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-gray-800 inline-flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  Looking for inspiration?
                </h2>
                <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
                  Click on any suggestion below to jump-start your decision process
                </p>
              </div>
              
              <ModernSuggestionCloud 
                suggestions={decisionSuggestions}
                onSelect={handleSuggestionSelect}
              />
            </div>
          </div>
          
          {/* AI Info Section */}
          <div className="mt-8 sm:mt-16 ai-container p-5 sm:p-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-ai-glow/20 rounded-full flex items-center justify-center mb-4 shadow-glow">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6 sm:w-8 sm:h-8 text-ai-glow"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-primary-purple mb-3 sm:mb-4">AI-Powered Decision Making</h3>
              <p className="text-gray-600 max-w-2xl text-sm sm:text-base">
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