'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useNotification } from '@/components/NotificationContext';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';

// Define decision types
type Option = {
  id?: string;
  name: string;
  ratings?: Record<string, number>;
  totalScore?: number;
  percentageScore?: number;
};

type Factor = {
  id: string;
  name: string;
  weight: number;
  description?: string;
};

type Decision = {
  id: string;
  title: string;
  type?: string;
  description: string;
  factors: Factor[];
  options: Option[];
  createdAt: string;
};

export default function DecisionDetail() {
  const [decision, setDecision] = useState<Decision | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isSavingCategory, setIsSavingCategory] = useState(false);
  const { showNotification } = useNotification();
  const { user, session } = useAuth();
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  
  // Available categories for selection
  const categories = [
    { value: 'career', label: 'Career Decision' },
    { value: 'purchase', label: 'Major Purchase' },
    { value: 'life', label: 'Life Change' },
    { value: 'custom', label: 'Custom Decision' },
  ];
  
  // Fetch decision details on component mount
  useEffect(() => {
    const fetchDecision = async () => {
      try {
        if (!user || !session) return;
        
        setIsLoading(true);
        
        const response = await fetch(`/api/decisions/${id}`, {
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch decision details');
        }
        
        const data = await response.json();
        setDecision(data);
      } catch (error) {
        console.error('Error fetching decision details:', error);
        showNotification('Could not load decision details. Please try again later.', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDecision();
  }, [id, user, session, showNotification]);
  
  // Get decision type label
  const getTypeLabel = (type: string = 'custom') => {
    switch (type) {
      case 'career': return 'Career Decision';
      case 'life': return 'Life Change';
      case 'purchase': return 'Major Purchase';
      default: return 'Custom Decision';
    }
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Unknown date';
    
    try {
      // Try parsing as ISO string
      const date = new Date(dateString);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        console.log('Invalid date:', dateString);
        return 'Invalid date';
      }
      
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error, dateString);
      return 'Invalid date';
    }
  };
  
  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };
  
  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };
  
  const handleConfirmDelete = async () => {
    if (!session?.access_token || !id) {
      showNotification('Unable to delete decision', 'error');
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
      
      showNotification('Decision deleted successfully', 'success');
      router.push('/dashboard');
    } catch (error) {
      console.error('Error deleting decision:', error);
      showNotification('Could not delete the decision. Please try again.', 'error');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };
  
  // Handle category edit display
  const handleEditCategory = () => {
    if (decision) {
      setSelectedCategory(decision.type || 'custom');
      setIsEditingCategory(true);
    }
  };
  
  // Cancel category edit
  const handleCancelCategoryEdit = () => {
    setIsEditingCategory(false);
  };
  
  // Save updated category
  const handleSaveCategory = async () => {
    if (!decision || !session?.access_token) return;
    
    try {
      setIsSavingCategory(true);
      
      const response = await fetch(`/api/decisions/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ type: selectedCategory })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update decision category');
      }
      
      const updatedDecision = await response.json();
      setDecision(updatedDecision);
      showNotification('Decision category updated successfully', 'success');
    } catch (error) {
      console.error('Error updating category:', error);
      showNotification('Could not update decision category', 'error');
    } finally {
      setIsSavingCategory(false);
      setIsEditingCategory(false);
    }
  };
  
  return (
    <ProtectedRoute>
      {isLoading ? (
        <div className="glass-card p-12 text-center">
          <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <svg className="animate-spin h-10 w-10 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p className="text-gray-600">Loading decision details...</p>
        </div>
      ) : !decision ? (
        <div className="glass-card p-6 text-center">
          <p className="text-gray-600 mb-4">Could not find decision details.</p>
          <Link href="/dashboard" className="btn-primary">
            Return to Dashboard
          </Link>
        </div>
      ) : (
        <>
          {/* Delete Confirmation Modal */}
          {showDeleteConfirm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="glass-card p-6 max-w-lg w-full mx-4">
                <h3 className="text-xl font-bold mb-4">Delete Decision</h3>
                <p className="mb-6">
                  Are you sure you want to delete <strong>{decision.title}</strong>? This action cannot be undone.
                </p>
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={handleCancelDelete}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    disabled={isDeleting}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    disabled={isDeleting}
                  >
                    {isDeleting ? 'Deleting...' : 'Delete'}
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
                      <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-700">Dashboard</Link>
                    </li>
                    <li>
                      <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                      </svg>
                    </li>
                    <li>
                      <span className="text-sm font-medium text-primary-indigo">Decision Details</span>
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-primary py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                <div className="mb-4 md:mb-0">
                  {isEditingCategory ? (
                    <div className="flex items-center space-x-2 mb-2">
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="bg-white/20 text-white border border-white/30 rounded-full px-3 py-1 text-sm"
                      >
                        {categories.map((category) => (
                          <option key={category.value} value={category.value} className="bg-slate-700 text-white">
                            {category.label}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={handleSaveCategory}
                        disabled={isSavingCategory}
                        className="bg-white/20 hover:bg-white/30 text-white rounded-full p-1"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <button
                        onClick={handleCancelCategoryEdit}
                        className="bg-white/20 hover:bg-white/30 text-white rounded-full p-1"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/20 text-white mb-2 cursor-pointer hover:bg-white/30"
                      onClick={handleEditCategory}
                    >
                      {getTypeLabel(decision?.type)}
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </div>
                  )}
                  <h1 className="text-3xl md:text-4xl font-bold text-white">{decision?.title}</h1>
                  <p className="text-white/80 mt-2">
                    Created {decision && formatDate(decision.createdAt)}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleDeleteClick}
                    className="inline-flex items-center px-4 py-2 rounded-md text-white bg-red-500/20 hover:bg-red-500/30"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex-1 py-10 px-8 bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="max-w-6xl mx-auto">
              <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
                {/* Left column - Decision Info */}
                <div className="lg:col-span-1">
                  <div className="glass-card p-6 mb-6">
                    <h2 className="text-xl font-bold mb-4">Decision Information</h2>
                    
                    {decision.description && (
                      <div className="mb-6">
                        <h3 className="text-sm text-gray-500 mb-2">Description</h3>
                        <p className="text-gray-700">{decision.description}</p>
                      </div>
                    )}
                    
                    <div className="mb-6">
                      <h3 className="text-sm text-gray-500 mb-2">Factors ({decision.factors.length})</h3>
                      <div className="space-y-3">
                        {decision.factors.map((factor) => (
                          <div key={factor.id} className="bg-white p-3 rounded-md border border-gray-200">
                            <div className="flex justify-between">
                              <div className="font-medium">{factor.name}</div>
                              <div className="text-gray-500 text-sm">Weight: {factor.weight}</div>
                            </div>
                            {factor.description && (
                              <div className="text-sm text-gray-600 mt-1">{factor.description}</div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Right column - Results */}
                <div className="lg:col-span-2">
                  <div className="glass-card p-6 mb-6">
                    <h2 className="text-xl font-bold mb-6">Decision Results</h2>
                    
                    {/* Top recommendation */}
                    {decision.options.length > 0 && (
                      <div className="mb-8 p-6 bg-blue-50 border border-blue-200 rounded-lg shadow-sm">
                        <h3 className="text-xl font-bold mb-3 text-blue-800">
                          Top Recommendation: {decision.options[0].name}
                        </h3>
                        <div className="text-2xl font-bold mb-4 text-blue-600">
                          {decision.options[0].percentageScore || ''}%
                        </div>
                      </div>
                    )}
                    
                    {/* All options */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold">All Options</h3>
                      
                      {decision.options.map((option, index) => (
                        <div key={option.id || index} className="mb-6 border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="text-lg font-medium">{option.name}</h4>
                            <div className="text-lg font-bold text-primary-indigo">
                              {option.percentageScore || ''}%
                            </div>
                          </div>
                          
                          <div className="w-full bg-gray-200 h-2 rounded-full mb-4">
                            <div 
                              className={`h-2 rounded-full ${index === 0 ? 'bg-primary' : 'bg-secondary'}`}
                              style={{ width: `${option.percentageScore || 0}%` }}
                            ></div>
                          </div>
                          
                          {option.ratings && Object.keys(option.ratings).length > 0 && (
                            <div className="mt-4">
                              <h5 className="text-sm font-medium text-gray-500 mb-2">Ratings by Factor</h5>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {Object.entries(option.ratings).map(([factorId, rating]) => {
                                  const factor = decision.factors.find(f => f.id === factorId);
                                  return factor ? (
                                    <div key={factorId} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                                      <span className="text-sm">{factor.name}</span>
                                      <span className="text-sm font-medium">{rating}/5</span>
                                    </div>
                                  ) : null;
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </ProtectedRoute>
  );
} 