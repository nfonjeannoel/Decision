'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useNotification } from '@/components/NotificationContext';

// Type definitions
type Factor = {
  id: string;
  name: string;
  weight: number;
  description: string;
};

type Rating = {
  [factorId: string]: number;
};

type Option = {
  id: string;
  name: string;
  ratings: Rating;
  totalScore?: number;
  percentageScore?: number;
};

// Default factors for custom decisions
const defaultFactors: Factor[] = [
  { id: 'factor1', name: 'Factor 1', weight: 3, description: 'Description for factor 1' },
  { id: 'factor2', name: 'Factor 2', weight: 3, description: 'Description for factor 2' },
];

export default function CustomDecision() {
  const [step, setStep] = useState(1);
  const [decisionTitle, setDecisionTitle] = useState('');
  const [decisionDescription, setDecisionDescription] = useState('');
  const [factors, setFactors] = useState<Factor[]>(defaultFactors);
  const [options, setOptions] = useState<Option[]>([
    { id: 'option1', name: '', ratings: {} },
    { id: 'option2', name: '', ratings: {} },
  ]);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [aiExplanation, setAiExplanation] = useState('');
  const [aiInsights, setAiInsights] = useState<any>(null);
  const [currentAiOperation, setCurrentAiOperation] = useState<string>('');
  const { showNotification } = useNotification();
  
  // Request to refine decision title and description
  const getAiRefinedDecision = async () => {
    if (!decisionTitle || !decisionDescription) {
      showNotification('Please provide both a title and description before refining with AI', 'warning');
      return;
    }
    
    setIsLoadingAI(true);
    setCurrentAiOperation('refining');
    
    try {
      const response = await fetch('/api/ai/refine', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: decisionTitle,
          description: decisionDescription,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get AI refinement');
      }
      
      const data = await response.json();
      
      if (data.title && data.description) {
        setDecisionTitle(data.title);
        setDecisionDescription(data.description);
      }
    } catch (error) {
      console.error('Error getting AI decision refinement:', error);
      showNotification('Could not refine your decision. Please try again later.', 'error');
    } finally {
      setIsLoadingAI(false);
      setCurrentAiOperation('');
    }
  };
  
  // Request AI-suggested factors
  const getAiSuggestedFactors = async () => {
    if (!decisionDescription) {
      showNotification('Please provide a description of your decision to get AI suggestions', 'warning');
      return;
    }
    
    setIsLoadingAI(true);
    setCurrentAiOperation('factors');
    
    try {
      const response = await fetch('/api/ai/factors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          decisionType: 'custom',
          description: decisionDescription,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get AI suggestions');
      }
      
      const data = await response.json();
      
      if (data.factors && data.factors.length > 0) {
        // Add unique IDs to factors if they don't have them
        const processedFactors = data.factors.map((factor: any, index: number) => ({
          ...factor,
          id: factor.id || `ai-factor-${index + 1}`,
        }));
        
        setFactors(processedFactors);
      } else {
        // Fall back to default factors if AI doesn't return anything useful
        setFactors(defaultFactors);
      }
    } catch (error) {
      console.error('Error getting AI factor suggestions:', error);
      showNotification('Could not get AI suggestions. Using default factors instead.', 'error');
    } finally {
      setIsLoadingAI(false);
      setCurrentAiOperation('');
    }
  };
  
  // Request AI to suggest optimal weights for factors
  const getAiSuggestedWeights = async () => {
    if (factors.some(f => !f.name)) {
      showNotification('Please provide names for all factors before optimizing weights', 'warning');
      return;
    }
    
    setIsLoadingAI(true);
    setCurrentAiOperation('weights');
    
    try {
      const response = await fetch('/api/ai/weights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: decisionTitle,
          description: decisionDescription,
          factors: factors,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get AI weight suggestions');
      }
      
      const data = await response.json();
      
      if (data.factors && data.factors.length > 0) {
        // Update existing factors with suggested weights
        const updatedFactors = factors.map(factor => {
          const suggestion = data.factors.find((f: any) => f.id === factor.id || f.name === factor.name);
          return suggestion ? { ...factor, weight: suggestion.weight } : factor;
        });
        
        setFactors(updatedFactors);
      }
    } catch (error) {
      console.error('Error getting AI weight suggestions:', error);
      showNotification('Could not optimize weights. Please adjust them manually.', 'error');
    } finally {
      setIsLoadingAI(false);
      setCurrentAiOperation('');
    }
  };
  
  // Request AI to suggest ratings for options
  const getAiSuggestedRatings = async () => {
    if (options.some(o => !o.name) || factors.some(f => !f.name)) {
      showNotification('Please provide names for all options and factors before getting AI ratings', 'warning');
      return;
    }
    
    setIsLoadingAI(true);
    setCurrentAiOperation('ratings');
    
    try {
      const response = await fetch('/api/ai/ratings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: decisionTitle,
          description: decisionDescription,
          factors,
          options: options.map(o => ({ id: o.id, name: o.name })),
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get AI rating suggestions');
      }
      
      const data = await response.json();
      
      if (data.options && data.options.length > 0) {
        // Update options with AI suggested ratings
        const updatedOptions = options.map(option => {
          const suggestion = data.options.find((o: any) => o.id === option.id || o.name === option.name);
          return suggestion ? { ...option, ratings: suggestion.ratings } : option;
        });
        
        setOptions(updatedOptions);
      }
    } catch (error) {
      console.error('Error getting AI rating suggestions:', error);
      showNotification('Could not generate ratings. Please rate options manually.', 'error');
    } finally {
      setIsLoadingAI(false);
      setCurrentAiOperation('');
    }
  };
  
  // Request AI analysis when options are set
  const getAiAnalysis = async () => {
    // Only request analysis if we have enough data
    if (options.some(option => !option.name || Object.keys(option.ratings).length < 3)) {
      return;
    }
    
    setIsLoadingAI(true);
    setCurrentAiOperation('analysis');
    
    try {
      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: decisionTitle,
          description: decisionDescription,
          factors,
          options,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get AI analysis');
      }
      
      const data = await response.json();
      
      if (data.insights) {
        setAiInsights(data.insights);
      }
    } catch (error) {
      console.error('Error getting AI analysis:', error);
    } finally {
      setIsLoadingAI(false);
      setCurrentAiOperation('');
    }
  };
  
  // Request AI explanation for top recommendation
  const getAiExplanation = async (topOption: Option) => {
    setIsLoadingAI(true);
    setCurrentAiOperation('explanation');
    
    try {
      const response = await fetch('/api/ai/explain', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          decision: {
            title: decisionTitle,
            description: decisionDescription,
            factors,
            options,
          },
          topOption,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get AI explanation');
      }
      
      const data = await response.json();
      
      if (data.explanation) {
        setAiExplanation(data.explanation);
      }
    } catch (error) {
      console.error('Error getting AI explanation:', error);
    } finally {
      setIsLoadingAI(false);
      setCurrentAiOperation('');
    }
  };
  
  // Handle factor weight change
  const handleWeightChange = (factorId: string, newWeight: number) => {
    setFactors(factors.map(factor => 
      factor.id === factorId ? { ...factor, weight: newWeight } : factor
    ));
  };
  
  // Add a new factor
  const handleAddFactor = () => {
    const newId = `factor${factors.length + 1}`;
    setFactors([...factors, { id: newId, name: '', weight: 2, description: '' }]);
  };
  
  // Remove a factor
  const handleRemoveFactor = (factorId: string) => {
    setFactors(factors.filter(factor => factor.id !== factorId));
  };
  
  // Update factor name
  const handleFactorNameChange = (factorId: string, name: string) => {
    setFactors(factors.map(factor => 
      factor.id === factorId ? { ...factor, name } : factor
    ));
  };
  
  // Update factor description
  const handleFactorDescriptionChange = (factorId: string, description: string) => {
    setFactors(factors.map(factor => 
      factor.id === factorId ? { ...factor, description } : factor
    ));
  };
  
  // Add a new option
  const handleAddOption = () => {
    const newId = `option${options.length + 1}`;
    setOptions([...options, { id: newId, name: '', ratings: {} }]);
  };
  
  // Remove an option
  const handleRemoveOption = (optionId: string) => {
    setOptions(options.filter(option => option.id !== optionId));
  };
  
  // Update option name
  const handleOptionNameChange = (optionId: string, name: string) => {
    setOptions(options.map(option => 
      option.id === optionId ? { ...option, name } : option
    ));
  };
  
  // Update option rating for a factor
  const handleRatingChange = (optionId: string, factorId: string, rating: number) => {
    setOptions(options.map(option => 
      option.id === optionId 
        ? { ...option, ratings: { ...option.ratings, [factorId]: rating } } 
        : option
    ));
  };
  
  // Calculate weighted scores
  const calculateScores = (): Option[] => {
    return options.map(option => {
      let totalScore = 0;
      let maxPossibleScore = 0;
      
      factors.forEach(factor => {
        const rating = option.ratings[factor.id] || 0;
        totalScore += rating * factor.weight;
        maxPossibleScore += 5 * factor.weight; // 5 is max rating
      });
      
      const percentageScore = maxPossibleScore > 0 
        ? (totalScore / maxPossibleScore) * 100 
        : 0;
      
      return {
        ...option,
        totalScore,
        percentageScore: Math.round(percentageScore),
      };
    });
  };
  
  // Get the strongest and weakest factors for an option
  const getFactorAnalysis = (option: Option) => {
    if (!option.ratings || Object.keys(option.ratings).length === 0) {
      return { strongFactors: [], weakFactors: [] };
    }
    
    const factorScores = factors.map(factor => ({
      factor,
      score: (option.ratings[factor.id] || 0) * factor.weight,
      maxScore: 5 * factor.weight,
    }));
    
    const sortedFactors = [...factorScores].sort((a, b) => 
      (b.score / b.maxScore) - (a.score / a.maxScore)
    );
    
    return {
      strongFactors: sortedFactors.slice(0, 2),
      weakFactors: sortedFactors.slice(-2).reverse(),
    };
  };
  
  const goToNextStep = () => setStep(step + 1);
  const goToPrevStep = () => setStep(step - 1);
  
  // Call AI analysis when we have sufficient data
  useEffect(() => {
    if (step === 3 && options.every(option => option.name && Object.keys(option.ratings).length > 0)) {
      getAiAnalysis();
    }
  }, [step, options]);
  
  // Process scores when displaying results
  const scoredOptions = calculateScores().sort((a, b) => 
    (b.percentageScore || 0) - (a.percentageScore || 0)
  );
  
  const topOption = scoredOptions[0];
  
  // Get explanation for top option when showing results
  useEffect(() => {
    if (step === 4 && topOption && !aiExplanation) {
      getAiExplanation(topOption);
    }
  }, [step, topOption]);
  
  // AI assistant button with specific text based on operation
  const AIButton = ({ onClick, operation, label, disabled = false }: { onClick: () => void, operation: string, label: string, disabled?: boolean }) => (
    <button
      className="px-4 py-2 bg-purple-600 text-white rounded flex items-center"
      onClick={onClick}
      disabled={isLoadingAI || disabled}
    >
      {isLoadingAI && currentAiOperation === operation ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </>
      ) : (
        <>
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          {label}
        </>
      )}
    </button>
  );
  
  // Check if a step is accessible
  const isStepAccessible = (stepNumber: number) => {
    if (stepNumber === 1) return true;
    if (stepNumber === 2) return !!decisionTitle;
    if (stepNumber === 3) return factors.length > 0 && !factors.some(f => !f.name);
    if (stepNumber === 4) return !options.some(o => !o.name) && !options.some(o => Object.keys(o.ratings).length === 0);
    return false;
  };

  // Navigate to a step if accessible
  const navigateToStep = (stepNumber: number) => {
    if (stepNumber === 1 || isStepAccessible(stepNumber)) {
      setStep(stepNumber);
    } else {
      if (stepNumber === 2 && !decisionTitle) {
        showNotification('Please provide a decision title before proceeding to Set Factors.', 'warning');
      } else if (stepNumber === 3 && (factors.length === 0 || factors.some((f) => !f.name))) {
        showNotification('Please ensure all factors have names before proceeding to Evaluate Options.', 'warning');
      } else if (stepNumber === 4) {
        showNotification('Please name all options and provide at least one rating per option before viewing Results.', 'warning');
      }
    }
  };
  
  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-full">
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
                  <Link href="/decisions/new" className="text-sm text-gray-500 hover:text-gray-700">New Decision</Link>
                </li>
                <li>
                  <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                  </svg>
                </li>
                <li>
                  <span className="text-sm font-medium text-primary-indigo">Custom Decision</span>
                </li>
              </ol>
            </nav>
          </div>
        </div>
      </div>
      
      {/* Decision Progress */}
      <div className="bg-gradient-primary py-8 px-4 sm:px-6 lg:px-8 shadow-md">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-white">
              {decisionTitle || 'Custom Decision'}
            </h1>
            <div className="flex items-center gap-2 text-white">
              <span className={`inline-flex justify-center items-center w-8 h-8 rounded-full ${step >= 1 ? 'bg-white text-primary-indigo' : 'bg-white/30'}`}>1</span>
              <div className={`w-8 h-1 ${step >= 2 ? 'bg-white' : 'bg-white/30'}`}></div>
              <span className={`inline-flex justify-center items-center w-8 h-8 rounded-full ${step >= 2 ? 'bg-white text-primary-indigo' : 'bg-white/30'}`}>2</span>
              <div className={`w-8 h-1 ${step >= 3 ? 'bg-white' : 'bg-white/30'}`}></div>
              <span className={`inline-flex justify-center items-center w-8 h-8 rounded-full ${step >= 3 ? 'bg-white text-primary-indigo' : 'bg-white/30'}`}>3</span>
              <div className={`w-8 h-1 ${step >= 4 ? 'bg-white' : 'bg-white/30'}`}></div>
              <span className={`inline-flex justify-center items-center w-8 h-8 rounded-full ${step >= 4 ? 'bg-white text-primary-indigo' : 'bg-white/30'}`}>4</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Rest of the component */}
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto p-4">
          <h1 className="text-3xl font-bold mb-4">Custom Decision</h1>
          
          {/* Step indicator as clickable breadcrumbs */}
          <div className="flex mb-6">
            <button 
              onClick={() => navigateToStep(1)}
              className={`flex-1 text-center py-2 ${step >= 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'} hover:opacity-90 transition-opacity cursor-pointer flex items-center justify-center`}
            >
              <span>1. Define Decision</span>
              {step > 1 && (
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
            </button>
            
            <button 
              onClick={() => navigateToStep(2)}
              className={`flex-1 text-center py-2 ${step >= 2 ? 'bg-blue-500 text-white' : 'bg-gray-200'} hover:opacity-90 transition-opacity cursor-pointer ${isStepAccessible(2) ? '' : 'opacity-70'} flex items-center justify-center`}
            >
              <span>2. Set Factors</span>
              {step > 2 && (
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
            </button>
            
            <button 
              onClick={() => navigateToStep(3)}
              className={`flex-1 text-center py-2 ${step >= 3 ? 'bg-blue-500 text-white' : 'bg-gray-200'} hover:opacity-90 transition-opacity cursor-pointer ${isStepAccessible(3) ? '' : 'opacity-70'} flex items-center justify-center`}
            >
              <span>3. Evaluate Options</span>
              {step > 3 && (
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
            </button>
            
            <button 
              onClick={() => navigateToStep(4)}
              className={`flex-1 text-center py-2 ${step >= 4 ? 'bg-blue-500 text-white' : 'bg-gray-200'} hover:opacity-90 transition-opacity cursor-pointer ${isStepAccessible(4) ? '' : 'opacity-70'} flex items-center justify-center`}
            >
              <span>4. Results</span>
            </button>
          </div>
          
          {/* Step 1: Define the decision */}
          {step === 1 && (
            <div>
              <div className="mb-4">
                <label className="block mb-2 font-semibold">Decision Title</label>
                <input 
                  type="text" 
                  className="w-full p-2 border rounded"
                  value={decisionTitle}
                  onChange={(e) => setDecisionTitle(e.target.value)}
                  placeholder="What are you deciding on?"
                />
              </div>
              
              <div className="mb-6">
                <label className="block mb-2 font-semibold">Description</label>
                <textarea 
                  className="w-full p-2 border rounded h-32"
                  value={decisionDescription}
                  onChange={(e) => setDecisionDescription(e.target.value)}
                  placeholder="Describe your decision in more detail..."
                />
              </div>
              
              <div className="mb-6 flex flex-col sm:flex-row justify-between gap-4">
                <AIButton 
                  onClick={getAiRefinedDecision} 
                  operation="refining" 
                  label="Refine with AI" 
                  disabled={!decisionTitle || !decisionDescription}
                />
              </div>
              
              <div className="flex justify-between">
                <Link href="/decisions/new" className="px-4 py-2 bg-gray-200 rounded">
                  Cancel
                </Link>
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                  onClick={goToNextStep}
                  disabled={!decisionTitle}
                >
                  Next
                </button>
              </div>
            </div>
          )}
          
          {/* Step 2: Set factors and weights */}
          {step === 2 && (
            <div>
              <h2 className="text-xl font-bold mb-4">Set Factors and Weights</h2>
              
              <div className="mb-6">
                {factors.map((factor) => (
                  <div key={factor.id} className="mb-4 p-4 border rounded">
                    <div className="flex flex-col md:flex-row md:items-center mb-2">
                      <input 
                        type="text" 
                        className="flex-grow p-2 border rounded mb-2 md:mb-0 md:mr-2"
                        value={factor.name}
                        onChange={(e) => handleFactorNameChange(factor.id, e.target.value)}
                        placeholder="Factor name"
                      />
                      
                      <div className="flex items-center">
                        <span className="mr-2">Weight:</span>
                        <select 
                          className="p-2 border rounded"
                          value={factor.weight}
                          onChange={(e) => handleWeightChange(factor.id, parseInt(e.target.value))}
                        >
                          <option value="1">1 - Low importance</option>
                          <option value="2">2</option>
                          <option value="3">3 - Medium importance</option>
                          <option value="4">4</option>
                          <option value="5">5 - High importance</option>
                        </select>
                        
                        <button 
                          className="ml-4 px-2 py-1 bg-red-500 text-white rounded"
                          onClick={() => handleRemoveFactor(factor.id)}
                          disabled={factors.length <= 1}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    
                    <input 
                      type="text" 
                      className="w-full p-2 border rounded"
                      value={factor.description}
                      onChange={(e) => handleFactorDescriptionChange(factor.id, e.target.value)}
                      placeholder="Description (optional)"
                    />
                  </div>
                ))}
              </div>
              
              <div className="mb-6 flex flex-col sm:flex-row justify-between gap-4">
                <button 
                  className="px-4 py-2 bg-green-500 text-white rounded"
                  onClick={handleAddFactor}
                >
                  Add Factor
                </button>
                <AIButton 
                  onClick={getAiSuggestedFactors} 
                  operation="factors" 
                  label="Suggest Factors with AI" 
                  disabled={!decisionDescription}
                />
                <AIButton 
                  onClick={getAiSuggestedWeights} 
                  operation="weights" 
                  label="Optimize Weights with AI" 
                  disabled={factors.some(f => !f.name)}
                />
              </div>
              
              <div className="flex justify-between">
                <button
                  className="px-4 py-2 bg-gray-200 rounded"
                  onClick={goToPrevStep}
                >
                  Back
                </button>
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                  onClick={goToNextStep}
                  disabled={factors.length === 0 || factors.some(f => !f.name)}
                >
                  Next
                </button>
              </div>
            </div>
          )}
          
          {/* Step 3: Evaluate options */}
          {step === 3 && (
            <div>
              <h2 className="text-xl font-bold mb-4">Evaluate Your Options</h2>
              
              <div className="mb-6 overflow-x-auto">
                <table className="min-w-full border">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2 border"></th>
                      {options.map((option) => (
                        <th key={option.id} className="p-2 border min-w-[200px]">
                          <input 
                            type="text" 
                            className="w-full p-2 border rounded"
                            value={option.name}
                            onChange={(e) => handleOptionNameChange(option.id, e.target.value)}
                            placeholder="Option name"
                          />
                          {options.length > 2 && (
                            <button 
                              className="mt-2 px-2 py-1 bg-red-500 text-white rounded text-sm"
                              onClick={() => handleRemoveOption(option.id)}
                            >
                              Remove
                            </button>
                          )}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {factors.map((factor) => (
                      <tr key={factor.id}>
                        <td className="p-3 border font-medium">
                          {factor.name} 
                          <span className="ml-1 text-sm text-gray-500">(x{factor.weight})</span>
                          {factor.description && (
                            <div className="text-xs text-gray-500">{factor.description}</div>
                          )}
                        </td>
                        {options.map((option) => (
                          <td key={`${option.id}-${factor.id}`} className="p-2 border text-center">
                            <select 
                              className="p-2 border rounded w-full"
                              value={option.ratings[factor.id] || 0}
                              onChange={(e) => handleRatingChange(option.id, factor.id, parseInt(e.target.value))}
                            >
                              <option value="0">Select...</option>
                              <option value="1">1 - Poor</option>
                              <option value="2">2 - Fair</option>
                              <option value="3">3 - Average</option>
                              <option value="4">4 - Good</option>
                              <option value="5">5 - Excellent</option>
                            </select>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mb-6 flex flex-col sm:flex-row justify-between gap-4">
                <button 
                  className="px-4 py-2 bg-green-500 text-white rounded"
                  onClick={handleAddOption}
                >
                  Add Option
                </button>
                <AIButton 
                  onClick={getAiSuggestedRatings} 
                  operation="ratings" 
                  label="Suggest Ratings with AI" 
                  disabled={options.some(o => !o.name) || factors.some(f => !f.name)}
                />
              </div>
              
              <div className="flex justify-between">
                <button
                  className="px-4 py-2 bg-gray-200 rounded"
                  onClick={goToPrevStep}
                >
                  Back
                </button>
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                  onClick={goToNextStep}
                  disabled={options.some(o => !o.name) || options.some(o => Object.keys(o.ratings).length === 0)}
                >
                  See Results
                </button>
              </div>
            </div>
          )}
          
          {/* Step 4: Results */}
          {step === 4 && (
            <div>
              <h2 className="text-xl font-bold mb-4">Decision Results</h2>
              
              {/* Top recommendation */}
              {topOption && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded">
                  <h3 className="text-lg font-bold mb-2">Top Recommendation: {topOption.name}</h3>
                  <div className="text-xl mb-2">{topOption.percentageScore}% match</div>
                  
                  {isLoadingAI && currentAiOperation === 'explanation' ? (
                    <div className="text-center p-4">Generating AI explanation...</div>
                  ) : aiExplanation ? (
                    <div className="mt-4">
                      <h4 className="font-semibold">AI Explanation:</h4>
                      <p className="mt-2">{aiExplanation}</p>
                    </div>
                  ) : (
                    <div className="mt-4">
                      <AIButton 
                        onClick={() => getAiExplanation(topOption)} 
                        operation="explanation" 
                        label="Get AI Explanation" 
                      />
                    </div>
                  )}
                </div>
              )}
              
              {/* Full results */}
              <div className="mb-6">
                <h3 className="text-lg font-bold mb-2">All Options</h3>
                
                {scoredOptions.map((option, index) => {
                  const { strongFactors, weakFactors } = getFactorAnalysis(option);
                  
                  return (
                    <div key={option.id} className="mb-4 p-4 border rounded">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="text-lg font-bold">{index + 1}. {option.name}</h4>
                        <div className="text-xl font-bold">{option.percentageScore}%</div>
                      </div>
                      
                      {/* Progress bar */}
                      <div className="w-full bg-gray-200 h-4 rounded-full mb-4">
                        <div 
                          className="bg-blue-500 h-4 rounded-full" 
                          style={{ width: `${option.percentageScore}%` }}
                        ></div>
                      </div>
                      
                      {/* Strength/Weakness analysis */}
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                          <h5 className="font-semibold text-green-600">Strengths:</h5>
                          <ul className="list-disc pl-5 mt-1">
                            {strongFactors.map(({ factor, score, maxScore }) => (
                              <li key={factor.id}>
                                {factor.name}: {score}/{maxScore} ({Math.round((score/maxScore) * 100)}%)
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="flex-1">
                          <h5 className="font-semibold text-red-600">Weaknesses:</h5>
                          <ul className="list-disc pl-5 mt-1">
                            {weakFactors.map(({ factor, score, maxScore }) => (
                              <li key={factor.id}>
                                {factor.name}: {score}/{maxScore} ({Math.round((score/maxScore) * 100)}%)
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="flex justify-between">
                <button
                  className="px-4 py-2 bg-gray-200 rounded"
                  onClick={goToPrevStep}
                >
                  Back
                </button>
                <Link href="/dashboard" className="px-4 py-2 bg-green-500 text-white rounded">
                  Save Decision
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 