'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useNotification } from '@/components/NotificationContext';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';

// Define decision types
type Option = {
  name: string;
  score: number;
  id?: string;
  ratings?: any;
  totalScore?: number;
  percentageScore?: number;
};

type Decision = {
  id: string;
  title: string;
  type?: string;
  description: string;
  factors: any[];
  options: Option[];
  createdAt: string;
};

// Empty decisions array
const emptyDecisions: Decision[] = [];

export default function Dashboard() {
  const [decisions, setDecisions] = useState<Decision[]>(emptyDecisions);
  const [filterType, setFilterType] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [showPendingModal, setShowPendingModal] = useState(false);
  const [pendingDecision, setPendingDecision] = useState<any>(null);
  const [isSavingPending, setIsSavingPending] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const { showNotification } = useNotification();
  const { user, session } = useAuth();
  const router = useRouter();
  
  // Check for pending decisions in localStorage
  useEffect(() => {
    try {
      const pendingDecisionJson = localStorage.getItem('pendingDecision');
      const referrer = localStorage.getItem('pendingDecisionReferrer');
      
      if (pendingDecisionJson && referrer === 'true' && user) {
        // Only show the save prompt if they came directly from the decision page
        const decision = JSON.parse(pendingDecisionJson);
        setPendingDecision(decision);
        setShowPendingModal(true);
      } else if (pendingDecisionJson) {
        // Clear the pending decision if they didn't come directly from the decision page
        localStorage.removeItem('pendingDecision');
      }
      
      // Always clear the referrer flag
      localStorage.removeItem('pendingDecisionReferrer');
    } catch (error) {
      console.error('Error checking for pending decisions:', error);
    }
  }, [user]);

  // Save pending decision from dashboard
  const savePendingDecision = async () => {
    if (!pendingDecision) return;
    
    try {
      setIsSavingPending(true);
      
      // Use the session from context instead of localStorage
      if (!session?.access_token) {
        console.error("No access token available in session");
        
        // Fallback to localStorage if needed, trying multiple possible formats
        let accessToken = null;
        
        // Try different possible localStorage keys for Supabase
        try {
          // Try current format
          const supabaseSession = JSON.parse(localStorage.getItem('supabase.auth.token') || '{}');
          accessToken = supabaseSession?.currentSession?.access_token;
          
          // Try sb-xxx-auth-token format (where xxx is the project reference)
          if (!accessToken) {
            // Find keys that match the pattern sb-*-auth-token
            const keys = Object.keys(localStorage);
            const supabaseKey = keys.find(key => key.startsWith('sb-') && key.endsWith('-auth-token'));
            
            if (supabaseKey) {
              const supabaseData = JSON.parse(localStorage.getItem(supabaseKey) || '{}');
              accessToken = supabaseData?.access_token || supabaseData?.currentSession?.access_token;
            }
          }
        } catch (e) {
          console.error("Error parsing localStorage data:", e);
        }
        
        if (!accessToken) {
          showNotification('Authentication error. Please try again.', 'error');
          return;
        }
        
        console.log("Using fallback access token from localStorage");
        
        // Save with fallback token
        await saveDecisionWithToken(accessToken);
      } else {
        // Use token from session context
        console.log("Using access token from session context");
        await saveDecisionWithToken(session.access_token);
      }
    } catch (error) {
      console.error('Error saving pending decision:', error);
      showNotification('Could not save your decision. Please try again.', 'error');
    } finally {
      setIsSavingPending(false);
      setShowPendingModal(false);
    }
  };
  
  // Helper function to save decision with a token
  const saveDecisionWithToken = async (token: string) => {
    const response = await fetch('/api/decisions/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(pendingDecision),
    });
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error('Server response error:', response.status, errorData);
      throw new Error(`Failed to save pending decision: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Clear the pending decision from localStorage
    localStorage.removeItem('pendingDecision');
    
    // Add the new decision to the decisions list
    if (data.decision && data.decision.id) {
      setDecisions([data.decision, ...decisions]);
      showNotification('Your decision has been saved successfully!', 'success');
      
      // Navigate to the decision page
      router.push(`/decisions/${data.decision.id}`);
    }
  };

  // Discard pending decision
  const discardPendingDecision = () => {
    localStorage.removeItem('pendingDecision');
    setShowPendingModal(false);
    setPendingDecision(null);
  };
  
  // Fetch decisions on component mount
  useEffect(() => {
    const fetchDecisions = async () => {
      try {
        if (!user || !session) return;
        
        setIsLoading(true);
        
        const response = await fetch('/api/decisions', {
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch decisions');
        }
        
        const data = await response.json();
        const fetchedDecisions = data.decisions || [];
        setDecisions(fetchedDecisions);
        
        // Extract unique categories from decisions
        const categories: string[] = [];
        fetchedDecisions.forEach((d: Decision) => {
          if (d.type && !categories.includes(d.type)) {
            categories.push(d.type);
          }
        });
        
        setAvailableCategories(categories);
      } catch (error) {
        console.error('Error fetching decisions:', error);
        showNotification('Could not load your decisions. Please try again later.', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDecisions();
  }, [user, session, showNotification]);
  
  // Filter decisions by type
  const filteredDecisions = filterType === 'all'
    ? decisions
    : decisions.filter(d => d.type === filterType);
  
  // Get decision type label
  const getTypeLabel = (type: string = 'custom') => {
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
  
  // Handle decision deletion
  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDeleteConfirmId(id);
  };

  const handleCancelDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDeleteConfirmId(null);
  };

  const handleConfirmDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!session?.access_token) {
      showNotification('You must be logged in to delete decisions', 'error');
      return;
    }
    
    try {
      setIsDeleting(true);
      
      const response = await fetch(`/api/decisions/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete decision');
      }
      
      // Remove the decision from the state
      setDecisions(decisions.filter(d => d.id !== id));
      showNotification('Decision deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting decision:', error);
      showNotification('Could not delete the decision. Please try again.', 'error');
    } finally {
      setIsDeleting(false);
      setDeleteConfirmId(null);
    }
  };
  
  return (
    <ProtectedRoute>
      {/* Pending Decision Modal */}
      {showPendingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="glass-card p-6 max-w-lg w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Save Your Decision</h3>
            <p className="mb-6">
              We found a decision you were working on: <strong>{pendingDecision?.title}</strong>. 
              Would you like to save it to your account?
            </p>
            <div className="flex gap-4 justify-end">
              <button 
                onClick={discardPendingDecision}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Discard
              </button>
              <button 
                onClick={savePendingDecision}
                disabled={isSavingPending}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
              >
                {isSavingPending ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </span>
                ) : 'Save Decision'}
              </button>
            </div>
          </div>
        </div>
      )}

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
            <div className="flex mb-4 md:mb-0 overflow-x-auto">
              <button 
                className={`px-4 py-2 rounded-l-lg ${filterType === 'all' ? 'bg-primary text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                onClick={() => setFilterType('all')}
              >
                All
              </button>
              
              {availableCategories.map((category, index) => (
                <button 
                  key={category}
                  className={`px-4 py-2 ${index === availableCategories.length - 1 ? 'rounded-r-lg' : ''} ${filterType === category ? 'bg-primary text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                  onClick={() => setFilterType(category)}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
            
            <Link href="/decisions/new" className="btn-primary">
              New Decision
            </Link>
          </div>
          
          {isLoading ? (
            <div className="glass-card p-12 text-center">
              <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <svg className="animate-spin h-10 w-10 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <p className="text-gray-600">Loading your decisions...</p>
            </div>
          ) : filteredDecisions.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDecisions.map((decision) => (
                <div key={decision.id} className="glass-card hover:shadow-lg transition-shadow relative">
                  <Link href={`/decisions/${decision.id}`} className="block p-6">
                    <div className="flex gap-3 items-center mb-2">
                      <div className="bg-primary/10 text-primary p-2 rounded">
                        {getTypeIcon(decision.type || 'custom')}
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
                            <div className="text-primary font-bold">{option.percentageScore || option.score || 0}%</div>
                          </div>
                          <div className="w-full bg-gray-200 h-2 rounded-full">
                            <div 
                              className={`h-2 rounded-full ${index === 0 ? 'bg-primary' : 'bg-secondary'}`}
                              style={{ width: `${option.percentageScore || option.score || 0}%` }}
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
                      Created on {decision.createdAt ? new Date(decision.createdAt).toLocaleDateString() : 'Unknown date'}
                    </div>
                  </Link>
                  
                  {/* Delete Button and Confirmation */}
                  <div className="absolute top-4 right-4 z-10">
                    {deleteConfirmId === decision.id ? (
                      <div className="flex items-center bg-white shadow-md rounded-md p-1">
                        <span className="text-xs text-gray-600 mr-2">Delete?</span>
                        <button 
                          onClick={(e) => handleConfirmDelete(e, decision.id)} 
                          className="text-red-500 hover:text-red-700 p-1"
                          disabled={isDeleting}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                        <button 
                          onClick={handleCancelDelete} 
                          className="text-gray-500 hover:text-gray-700 p-1"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={(e) => handleDeleteClick(e, decision.id)} 
                        className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-white hover:shadow-sm"
                        title="Delete decision"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
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
    </ProtectedRoute>
  );
} 