'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useNotification } from '@/components/NotificationContext';

// Define decision types
type Option = {
  name: string;
  score: number;
};

type Decision = {
  id: string;
  title: string;
  type: string;
  date: string;
  options: Option[];
};

// Empty decisions array
const emptyDecisions: Decision[] = [];

export default function Dashboard() {
  const [decisions, setDecisions] = useState<Decision[]>(emptyDecisions);
  const [filterType, setFilterType] = useState('all');
  const { showNotification } = useNotification();
  
  // Filter decisions by type
  const filteredDecisions = filterType === 'all'
    ? decisions
    : decisions.filter(d => d.type === filterType);
  
  // Get decision type label
  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'career': return 'Career Decision';
      case 'life': return 'Life Change';
      case 'purchase': return 'Major Purchase';
      default: return 'Custom Decision';
    }
  };
  
  // Get type icon
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'career':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5z" clipRule="evenodd" />
            <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
          </svg>
        );
      case 'purchase':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
            <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
          </svg>
        );
      case 'life':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
            <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
          </svg>
        );
    }
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
                  <span className="text-sm font-medium text-primary-indigo">Dashboard</span>
                </li>
              </ol>
            </nav>
          </div>
        </div>
      </div>
      
      <div className="bg-gradient-primary py-12 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                My Decisions
              </h1>
              <p className="text-white/80">
                View and manage your decision frameworks
              </p>
            </div>
            <Link href="/decisions/new" className="btn-primary">
              New Decision
            </Link>
          </div>
        </div>
      </div>

      <div className="flex-1 py-10 px-8 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-between items-center mb-8">
            <div className="flex mb-4 md:mb-0">
              <button 
                className={`px-4 py-2 rounded-l-lg ${filterType === 'all' ? 'bg-primary text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                onClick={() => setFilterType('all')}
              >
                All
              </button>
              <button 
                className={`px-4 py-2 ${filterType === 'career' ? 'bg-primary text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                onClick={() => setFilterType('career')}
              >
                Career
              </button>
              <button 
                className={`px-4 py-2 ${filterType === 'purchase' ? 'bg-primary text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                onClick={() => setFilterType('purchase')}
              >
                Purchase
              </button>
              <button 
                className={`px-4 py-2 rounded-r-lg ${filterType === 'life' ? 'bg-primary text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                onClick={() => setFilterType('life')}
              >
                Life
              </button>
            </div>
            
            <Link href="/decisions/new" className="btn-primary">
              New Decision
            </Link>
          </div>
          
          {filteredDecisions.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDecisions.map((decision) => (
                <Link key={decision.id} href={`/decisions/${decision.id}`} className="glass-card hover:shadow-lg transition-shadow">
                  <div className="p-6">
                    <div className="flex gap-3 items-center mb-2">
                      <div className="bg-primary/10 text-primary p-2 rounded">
                        {getTypeIcon(decision.type)}
                      </div>
                      <div className="text-sm font-medium text-gray-500">
                        {getTypeLabel(decision.type)}
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold mb-4">{decision.title}</h3>
                    
                    <div className="mb-4">
                      <div className="text-sm text-gray-500 mb-2">Top Options</div>
                      {decision.options.slice(0, 2).map((option, index) => (
                        <div key={index} className="mb-2">
                          <div className="flex justify-between items-center mb-1">
                            <div className="font-medium">{option.name}</div>
                            <div className="text-primary font-bold">{option.score}%</div>
                          </div>
                          <div className="w-full bg-gray-200 h-2 rounded-full">
                            <div 
                              className={`h-2 rounded-full ${index === 0 ? 'bg-primary' : 'bg-secondary'}`}
                              style={{ width: `${option.score}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                      
                      {decision.options.length > 2 && (
                        <div className="text-sm text-gray-500">
                          +{decision.options.length - 2} more options
                        </div>
                      )}
                    </div>
                    
                    <div className="text-sm text-gray-500">
                      Created on {new Date(decision.date).toLocaleDateString()}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="glass-card p-12 text-center">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-primary" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-2">No decisions found</h2>
              <p className="text-gray-600 mb-8 max-w-lg mx-auto">
                You haven't created any decisions yet. Start making better choices by creating your first decision framework.
              </p>
              <Link href="/decisions/new" className="btn-primary inline-block shadow-glow">
                Create Your First Decision
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
} 