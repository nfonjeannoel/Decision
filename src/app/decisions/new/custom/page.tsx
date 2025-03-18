'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useNotification } from '@/components/NotificationContext';
import { useAuth } from '@/contexts/AuthContext';

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

// Add a new ValidationMessage component for inline validation messages
const ValidationMessage = ({ message }: { message: string }) => (
  <div className="mt-1 text-red-600 text-sm font-medium">
    <div className="flex items-center">
      <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      {message}
    </div>
  </div>
);

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
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  const { showNotification } = useNotification();
  const { user, session } = useAuth();
  
  // Request to refine decision title and description
  const getAiRefinedDecision = async () => {
    if (!decisionTitle) {
      setFormErrors(prev => ({...prev, decisionTitle: 'Please provide a title before refining with AI'}));
      showNotification('Please provide a title before refining with AI', 'warning');
      return;
    }
    
    if (!decisionDescription) {
      // Use title as description
      setDecisionDescription(decisionTitle);
      showNotification('Using decision title as description', 'info');
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
    if (!decisionTitle) {
      setFormErrors(prev => ({...prev, decisionTitle: 'Please provide a decision title first'}));
      showNotification('Please provide a decision title before getting AI suggestions', 'warning');
      return;
    }
    
    if (!decisionDescription) {
      if (decisionTitle) {
        // Use title as description
        setDecisionDescription(decisionTitle);
        showNotification('Using decision title as description', 'info');
      } else {
        showNotification('Please provide a description of your decision to get AI suggestions', 'warning');
        return;
      }
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
  
  // Request AI to suggest a single new factor that is not already in the list
  const getAiSuggestedFactor = async () => {
    if (!decisionTitle) {
      setFormErrors(prev => ({...prev, decisionTitle: 'Please provide a decision title first'}));
      showNotification('Please provide a decision title before getting AI suggestions', 'warning');
      return;
    }
    
    if (!decisionDescription) {
      if (decisionTitle) {
        // Use title as description
        setDecisionDescription(decisionTitle);
        showNotification('Using decision title as description', 'info');
      } else {
        showNotification('Please provide a description of your decision to get AI suggestions', 'warning');
        return;
      }
    }
    
    setIsLoadingAI(true);
    setCurrentAiOperation('factor');
    
    try {
      const response = await fetch('/api/ai/factor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          decisionType: 'custom',
          description: decisionDescription,
          existingFactors: factors.map(f => f.name).filter(name => name),
          title: decisionTitle
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get AI factor suggestion');
      }
      
      const data = await response.json();
      
      if (data.factor && data.factor.name) {
        const newId = `factor${factors.length + 1}`;
        const newFactor = {
          id: newId,
          name: data.factor.name,
          weight: data.factor.weight || 3,
          description: data.factor.description || ''
        };
        
        setFactors([...factors, newFactor]);
        showNotification(`Added new factor: ${data.factor.name}`, 'success');
      }
    } catch (error) {
      console.error('Error getting AI factor suggestion:', error);
      showNotification('Could not generate factor. Please add one manually.', 'error');
    } finally {
      setIsLoadingAI(false);
      setCurrentAiOperation('');
    }
  };
  
  // Request AI-suggested weights
  const getAiSuggestedWeights = async () => {
    if (factors.some((f) => !f.name)) {
      showNotification('Please provide names for all factors before optimizing weights', 'warning');
      return;
    }
    
    if (!decisionDescription && decisionTitle) {
      // Use title as description
      setDecisionDescription(decisionTitle);
      showNotification('Using decision title as description', 'info');
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
  
  // Request AI-suggested ratings
  const getAiSuggestedRatings = async () => {
    if (options.some((o) => !o.name) || factors.some((f) => !f.name)) {
      if (options.some((o) => !o.name)) {
        setFormErrors(prev => ({...prev, optionNames: 'Please provide names for all options first'}));
      }
      
      if (factors.some((f) => !f.name)) {
        setFormErrors(prev => ({...prev, factorNames: 'Please provide names for all factors first'}));
      }
      
      showNotification('Please provide names for all options and factors before getting AI ratings', 'warning');
      return;
    }
    
    setFormErrors({});
    
    if (!decisionDescription && decisionTitle) {
      // Use title as description
      setDecisionDescription(decisionTitle);
      showNotification('Using decision title as description', 'info');
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
        showNotification('Successfully generated ratings for your options', 'success');
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
  
  // Navigation functions
  const goToNextStep = () => {
    // Reset form errors
    setFormErrors({});
    
    // Step-specific validation
    if (step === 1 && !decisionTitle) {
      setFormErrors({decisionTitle: 'Please provide a decision title before proceeding'});
      return;
    }
    
    if (step === 2 && (factors.length === 0 || factors.some(f => !f.name))) {
      setFormErrors({factorNames: 'Please ensure all factors have names before proceeding'});
      return;
    }
    
    if (step === 3) {
      if (options.some(o => !o.name)) {
        setFormErrors({optionNames: 'Please name all options before proceeding'});
        return;
      }
      
      if (options.some(o => Object.keys(o.ratings).length === 0)) {
        setFormErrors({optionRatings: 'Please rate at least one factor for each option'});
        return;
      }
    }
    
    // If no description is provided, use the title as the description
    if (!decisionDescription && decisionTitle) {
      setDecisionDescription(decisionTitle);
      showNotification('Using decision title as description', 'info');
    }
    
    setStep(step + 1);
  };
  
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
  const AIButton = ({ onClick, operation, label, disabled = false, className = '', errorMessage = '' }: { 
    onClick: () => void, 
    operation: string, 
    label: string, 
    disabled?: boolean, 
    className?: string,
    errorMessage?: string
  }) => (
    <div className="flex flex-col">
      <button
        className={`px-4 py-3 ${disabled ? 'bg-indigo-300' : 'bg-indigo-600 hover:bg-indigo-700'} text-white rounded-md flex items-center justify-center font-medium transition-colors ${className}`}
        onClick={onClick}
        disabled={isLoadingAI || disabled}
        aria-describedby={`${operation}-error-message`}
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
      {disabled && errorMessage && (
        <div id={`${operation}-error-message`} className="mt-1 text-red-600 text-xs">
          {errorMessage}
        </div>
      )}
    </div>
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
    setFormErrors({}); // Clear any existing form errors
    
    if (stepNumber === 1 || isStepAccessible(stepNumber)) {
      setStep(stepNumber);
    } else {
      if (stepNumber === 2 && !decisionTitle) {
        setFormErrors({decisionTitle: 'Please provide a decision title first'});
        showNotification('Please provide a decision title before proceeding to Set Factors.', 'warning');
      } else if (stepNumber === 3 && (factors.length === 0 || factors.some((f) => !f.name))) {
        setFormErrors({factorNames: 'Please ensure all factors have names'});
        showNotification('Please ensure all factors have names before proceeding to Evaluate Options.', 'warning');
      } else if (stepNumber === 4) {
        if (options.some(o => !o.name)) {
          setFormErrors({optionNames: 'Please name all options first'});
        } else if (options.some(o => Object.keys(o.ratings).length === 0)) {
          setFormErrors({optionRatings: 'Please provide at least one rating per option'});
        }
        showNotification('Please name all options and provide at least one rating per option before viewing Results.', 'warning');
      }
    }
  };
  
  // Request AI to suggest a new option
  const getAiSuggestedOption = async () => {
    if (factors.some(f => !f.name)) {
      setFormErrors(prev => ({...prev, factorNames: 'Please name all factors before generating AI options'}));
      showNotification('Please provide names for all factors before generating AI options', 'warning');
      return;
    }
    
    if (!decisionDescription && decisionTitle) {
      // Use title as description
      setDecisionDescription(decisionTitle);
      showNotification('Using decision title as description', 'info');
    }
    
    setIsLoadingAI(true);
    setCurrentAiOperation('option');
    
    try {
      const response = await fetch('/api/ai/option', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: decisionTitle,
          description: decisionDescription,
          factors,
          existingOptions: options.map(o => o.name).filter(name => name)
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get AI option suggestion');
      }
      
      const data = await response.json();
      
      if (data.optionName) {
        const newId = `option${options.length + 1}`;
        setOptions([...options, { id: newId, name: data.optionName, ratings: {} }]);
        showNotification(`Added new option: ${data.optionName}`, 'success');
      }
    } catch (error) {
      console.error('Error getting AI option suggestion:', error);
      showNotification('Could not generate option. Please add one manually.', 'error');
    } finally {
      setIsLoadingAI(false);
      setCurrentAiOperation('');
    }
  };
  
  // Request AI-suggested default options
  const getAiDefaultOptions = async () => {
    if (factors.some((f) => !f.name)) {
      setFormErrors(prev => ({...prev, factorNames: 'Please provide names for all factors first'}));
      showNotification('Please provide names for all factors before getting AI suggestions', 'warning');
      return;
    }
    
    setFormErrors({});
    
    if (!decisionDescription && decisionTitle) {
      // Use title as description
      setDecisionDescription(decisionTitle);
      showNotification('Using decision title as description', 'info');
    }
    
    setIsLoadingAI(true);
    setCurrentAiOperation('defaults');
    
    try {
      // First, get contextually relevant option names
      const optionsResponse = await fetch('/api/ai/options', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: decisionTitle,
          description: decisionDescription,
          factors,
          count: options.length
        }),
      });
      
      if (!optionsResponse.ok) {
        throw new Error('Failed to get AI option suggestions');
      }
      
      const optionsData = await optionsResponse.json();
      let updatedOptions = [...options];
      
      // Update option names with meaningful suggestions
      if (optionsData.options && optionsData.options.length > 0) {
        updatedOptions = options.map((option, index) => {
          // Use suggested name if option doesn't have a name yet
          if (!option.name && index < optionsData.options.length) {
            return { ...option, name: optionsData.options[index].name };
          }
          return option;
        });
        
        // Update state with meaningful option names
        setOptions(updatedOptions);
      }
      
      // Then get ratings for these options
      const ratingsResponse = await fetch('/api/ai/ratings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: decisionTitle,
          description: decisionDescription,
          factors,
          options: updatedOptions.map(o => ({ id: o.id, name: o.name })),
        }),
      });
      
      if (!ratingsResponse.ok) {
        throw new Error('Failed to get AI rating suggestions');
      }
      
      const ratingsData = await ratingsResponse.json();
      
      if (ratingsData.options && ratingsData.options.length > 0) {
        // Update options with AI suggested ratings
        const finalOptions = updatedOptions.map(option => {
          const suggestion = ratingsData.options.find((o: any) => o.id === option.id || o.name === option.name);
          if (suggestion) {
            return { ...option, ratings: suggestion.ratings };
          }
          return option;
        });
        
        setOptions(finalOptions);
        showNotification('Successfully generated context-relevant options with ratings', 'success');
      }
    } catch (error) {
      console.error('Error getting AI default suggestions:', error);
      showNotification('Could not generate default options. Please add options manually.', 'error');
    } finally {
      setIsLoadingAI(false);
      setCurrentAiOperation('');
    }
  };
  
  // Function to store decision in localStorage
  const storePendingDecision = () => {
    const pendingDecision = {
      title: decisionTitle,
      description: decisionDescription,
      factors,
      options: scoredOptions || options,
      type: 'custom',
      savedAt: new Date().toISOString()
    };
    
    localStorage.setItem('pendingDecision', JSON.stringify(pendingDecision));
    // Add a flag to indicate coming directly from decision page
    localStorage.setItem('pendingDecisionReferrer', 'true');
    showNotification('Decision saved locally. Please log in to save to your account.', 'info');
  };
  
  // Save the decision
  const saveDecision = async () => {
    if (!user || !session) {
      showNotification('Please log in to save your decision', 'warning');
      return;
    }
    
    setIsLoadingAI(true);
    setCurrentAiOperation('saving');
    
    try {
      const response = await fetch('/api/decisions/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          title: decisionTitle,
          description: decisionDescription,
          factors,
          options: scoredOptions,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error('Server response:', response.status, errorData);
        throw new Error(`Failed to save decision: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      showNotification('Decision saved successfully!', 'success');
      
      // Navigate to dashboard after successful save
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Error saving decision:', error);
      showNotification(`Could not save your decision: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
    } finally {
      setIsLoadingAI(false);
      setCurrentAiOperation('');
    }
  };
  
  return (
    <div className="bg-white min-h-screen">
      {/* Header with branding */}
      <header className="bg-slate-900 text-white py-6 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-3xl font-bold">Decidr</h1>
              <p className="text-slate-300 mt-1">Clarity when it matters most</p>
            </div>
            <div className="flex items-center space-x-4">
              <nav className="flex" aria-label="Breadcrumb">
                <ol className="flex items-center space-x-2 text-xs sm:text-sm overflow-x-auto">
                  <li>
                    <Link href="/" className="text-slate-300 hover:text-white whitespace-nowrap">Home</Link>
                  </li>
                  <li>
                    <svg className="h-5 w-5 text-slate-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                    </svg>
                  </li>
                  <li>
                    <Link href="/decisions/new" className="text-slate-300 hover:text-white whitespace-nowrap">New Decision</Link>
                  </li>
                  <li>
                    <svg className="h-5 w-5 text-slate-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                    </svg>
                  </li>
                  <li>
                    <span className="text-sm font-medium text-white whitespace-nowrap">Custom Decision</span>
                  </li>
                </ol>
              </nav>
              
              {user ? (
                <div className="flex items-center bg-slate-800 px-4 py-2 rounded-md">
                  <div className="mr-2 w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                    {user.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="text-sm">
                    <p className="font-medium">{user.email}</p>
                    <Link href="/api/auth/signout" className="text-xs text-slate-400 hover:text-white">
                      Sign out
                    </Link>
                  </div>
                </div>
              ) : (
                <Link href="/login" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-all font-medium">
                  Log in
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>
      
      {/* Decision Progress */}
      <div className="bg-white border-b py-4 sm:py-6 px-4 sm:px-6 lg:px-8 mb-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">
              {decisionTitle || 'Custom Decision'}
            </h2>
            <div className="flex items-center gap-1 sm:gap-2">
              <span className={`inline-flex justify-center items-center w-8 h-8 sm:w-10 sm:h-10 rounded-full ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'} font-semibold`}>1</span>
              <div className={`w-6 sm:w-12 h-1 ${step >= 2 ? 'bg-blue-600' : 'bg-slate-200'}`}></div>
              <span className={`inline-flex justify-center items-center w-8 h-8 sm:w-10 sm:h-10 rounded-full ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'} font-semibold`}>2</span>
              <div className={`w-6 sm:w-12 h-1 ${step >= 3 ? 'bg-blue-600' : 'bg-slate-200'}`}></div>
              <span className={`inline-flex justify-center items-center w-8 h-8 sm:w-10 sm:h-10 rounded-full ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'} font-semibold`}>3</span>
              <div className={`w-6 sm:w-12 h-1 ${step >= 4 ? 'bg-blue-600' : 'bg-slate-200'}`}></div>
              <span className={`inline-flex justify-center items-center w-8 h-8 sm:w-10 sm:h-10 rounded-full ${step >= 4 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'} font-semibold`}>4</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Step indicator as clickable buttons */}
          <div className="flex mb-8 flex-wrap text-sm">
            <button 
              onClick={() => navigateToStep(1)}
              className={`flex-1 min-w-[80px] text-center py-3 ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-white text-slate-800 border border-slate-300'} hover:opacity-90 transition-opacity cursor-pointer flex items-center justify-center rounded-l-md`}
            >
              <span className="truncate font-medium">1. Define</span>
              {step > 1 && (
                <svg className="w-4 h-4 ml-1 sm:ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
            </button>
            
            <button 
              onClick={() => navigateToStep(2)}
              className={`flex-1 min-w-[80px] text-center py-3 ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-white text-slate-800 border-t border-b border-slate-300'} hover:opacity-90 transition-opacity cursor-pointer ${isStepAccessible(2) ? '' : 'opacity-70'} flex items-center justify-center`}
            >
              <span className="truncate font-medium">2. Factors</span>
              {step > 2 && (
                <svg className="w-4 h-4 ml-1 sm:ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
            </button>
            
            <button 
              onClick={() => navigateToStep(3)}
              className={`flex-1 min-w-[80px] text-center py-3 ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-white text-slate-800 border-t border-b border-slate-300'} hover:opacity-90 transition-opacity cursor-pointer ${isStepAccessible(3) ? '' : 'opacity-70'} flex items-center justify-center`}
            >
              <span className="truncate font-medium">3. Options</span>
              {step > 3 && (
                <svg className="w-4 h-4 ml-1 sm:ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
            </button>
            
            <button 
              onClick={() => navigateToStep(4)}
              className={`flex-1 min-w-[80px] text-center py-3 ${step >= 4 ? 'bg-blue-600 text-white' : 'bg-white text-slate-800 border border-slate-300'} hover:opacity-90 transition-opacity cursor-pointer ${isStepAccessible(4) ? '' : 'opacity-70'} flex items-center justify-center rounded-r-md`}
            >
              <span className="truncate font-medium">4. Results</span>
            </button>
          </div>
          
          {/* Content card */}
          <div className="bg-white rounded-lg shadow-md border border-slate-200 p-6 mb-8">
            {/* Step 1: Define the decision */}
            {step === 1 && (
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Define Your Decision</h2>
                <div className="mb-6">
                  <label className="block mb-2 font-semibold text-slate-700">Decision Title</label>
                  <input 
                    type="text" 
                    className={`w-full p-3 border rounded-md text-base ${formErrors.decisionTitle ? 'border-red-500' : 'border-slate-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    value={decisionTitle}
                    onChange={(e) => setDecisionTitle(e.target.value)}
                    placeholder="What are you deciding on?"
                  />
                  {formErrors.decisionTitle && (
                    <ValidationMessage message={formErrors.decisionTitle} />
                  )}
                </div>
                
                <div className="mb-8">
                  <label className="block mb-2 font-semibold text-slate-700">Description</label>
                  <textarea 
                    className="w-full p-3 border border-slate-300 rounded-md h-32 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={decisionDescription}
                    onChange={(e) => setDecisionDescription(e.target.value)}
                    placeholder="Describe your decision in more detail..."
                  />
                </div>
                
                <div className="mb-8 flex justify-between gap-4">
                  <AIButton 
                    onClick={getAiRefinedDecision} 
                    operation="refining" 
                    label="Refine with AI" 
                    disabled={!decisionTitle}
                    errorMessage={!decisionTitle ? "Enter a decision title first" : ""}
                  />
                </div>
                
                <div className="flex justify-between">
                  <Link href="/decisions/new" className="px-5 py-3 bg-slate-100 text-slate-700 rounded-md font-medium hover:bg-slate-200 transition-colors">
                    Cancel
                  </Link>
                  <button
                    className="px-5 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
                    onClick={goToNextStep}
                    disabled={!decisionTitle}
                  >
                    Next Step
                  </button>
                </div>
              </div>
            )}
            
            {/* Step 2: Set factors and weights */}
            {step === 2 && (
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Set Factors and Weights</h2>
                
                {formErrors.factorNames && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                    <ValidationMessage message={formErrors.factorNames} />
                  </div>
                )}
                
                <div className="mb-8">
                  {factors.map((factor) => (
                    <div key={factor.id} className="mb-4 p-4 border border-slate-200 rounded-md shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex flex-col mb-3">
                        <input 
                          type="text" 
                          className={`w-full p-3 border rounded-md mb-3 text-base ${!factor.name && formErrors.factorNames ? 'border-red-500' : 'border-slate-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                          value={factor.name}
                          onChange={(e) => handleFactorNameChange(factor.id, e.target.value)}
                          placeholder="Factor name"
                        />
                        
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="whitespace-nowrap font-medium text-slate-700">Weight:</span>
                          <select 
                            className="p-2 border border-slate-300 rounded-md text-base flex-grow focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                            className="px-3 py-2 bg-red-600 text-white rounded-md ml-auto hover:bg-red-700 transition-colors disabled:bg-red-300 disabled:cursor-not-allowed"
                            onClick={() => handleRemoveFactor(factor.id)}
                            disabled={factors.length <= 1}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                      
                      <input 
                        type="text" 
                        className="w-full p-3 border border-slate-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={factor.description}
                        onChange={(e) => handleFactorDescriptionChange(factor.id, e.target.value)}
                        placeholder="Description (optional)"
                      />
                    </div>
                  ))}
                </div>
                
                <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <button 
                    className="px-4 py-3 bg-green-600 text-white rounded-md text-sm sm:text-base font-medium hover:bg-green-700 transition-colors"
                    onClick={handleAddFactor}
                  >
                    Add Factor
                  </button>
                  <AIButton 
                    onClick={getAiSuggestedFactors} 
                    operation="factors" 
                    label="Suggest Factors with AI" 
                    disabled={!decisionTitle}
                    errorMessage={!decisionTitle ? "Enter a decision title first" : ""}
                  />
                  <AIButton 
                    onClick={getAiSuggestedFactor} 
                    operation="factor" 
                    label="Add Factor with AI" 
                    disabled={!decisionTitle}
                    errorMessage={!decisionTitle ? "Enter a decision title first" : ""}
                  />
                  <AIButton 
                    onClick={getAiSuggestedWeights} 
                    operation="weights" 
                    label="Optimize Weights with AI" 
                    disabled={factors.some(f => !f.name)}
                    errorMessage={factors.some(f => !f.name) ? "Name all factors first" : ""}
                  />
                </div>
                
                <div className="flex justify-between">
                  <button
                    className="px-5 py-3 bg-slate-100 text-slate-700 rounded-md font-medium hover:bg-slate-200 transition-colors"
                    onClick={goToPrevStep}
                  >
                    Back
                  </button>
                  <button
                    className="px-5 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
                    onClick={goToNextStep}
                    disabled={factors.length === 0 || factors.some(f => !f.name)}
                  >
                    Next Step
                  </button>
                </div>
              </div>
            )}
            
            {/* Step 3: Evaluate options */}
            {step === 3 && (
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Evaluate Your Options</h2>
                
                {(formErrors.optionNames || formErrors.optionRatings) && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                    {formErrors.optionNames && <ValidationMessage message={formErrors.optionNames} />}
                    {formErrors.optionRatings && <ValidationMessage message={formErrors.optionRatings} />}
                  </div>
                )}
                
                {/* Mobile view - Card layout for options/ratings */}
                <div className="block sm:hidden mb-8">
                  {options.map((option) => (
                    <div key={option.id} className="mb-6 border border-slate-200 rounded-md shadow-sm p-4">
                      <div className="mb-4">
                        <input 
                          type="text" 
                          className={`w-full p-3 border rounded-md text-base font-medium ${!option.name && formErrors.optionNames ? 'border-red-500' : 'border-slate-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                          value={option.name}
                          onChange={(e) => handleOptionNameChange(option.id, e.target.value)}
                          placeholder="Option name"
                        />
                        {options.length > 2 && (
                          <button 
                            className="mt-3 px-3 py-2 bg-red-600 text-white rounded-md text-sm w-full hover:bg-red-700 transition-colors"
                            onClick={() => handleRemoveOption(option.id)}
                          >
                            Remove Option
                          </button>
                        )}
                      </div>
                      
                      <div>
                        {factors.map((factor) => (
                          <div key={`mobile-${option.id}-${factor.id}`} className="mb-4 pb-4 border-b border-slate-200">
                            <div className="font-medium mb-2 text-slate-800">
                              {factor.name}
                              <span className="ml-1 text-sm text-slate-500">(x{factor.weight})</span>
                            </div>
                            {factor.description && (
                              <div className="text-sm text-slate-600 mb-2">{factor.description}</div>
                            )}
                            <select 
                              className={`p-3 border rounded-md w-full text-base ${Object.keys(option.ratings).length === 0 && formErrors.optionRatings ? 'border-red-500' : 'border-slate-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
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
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Desktop view - Table layout */}
                <div className="hidden sm:block mb-8 overflow-x-auto">
                  <table className="min-w-full border-collapse">
                    <thead>
                      <tr className="bg-slate-50">
                        <th className="p-3 border border-slate-200 text-left text-slate-600"></th>
                        {options.map((option) => (
                          <th key={option.id} className="p-3 border border-slate-200 min-w-[200px]">
                            <input 
                              type="text" 
                              className={`w-full p-2 border rounded-md ${!option.name && formErrors.optionNames ? 'border-red-500' : 'border-slate-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                              value={option.name}
                              onChange={(e) => handleOptionNameChange(option.id, e.target.value)}
                              placeholder="Option name"
                            />
                            {options.length > 2 && (
                              <button 
                                className="mt-2 px-2 py-1 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 transition-colors"
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
                          <td className="p-3 border border-slate-200 font-medium text-slate-800">
                            {factor.name} 
                            <span className="ml-1 text-sm text-slate-500">(x{factor.weight})</span>
                            {factor.description && (
                              <div className="text-xs text-slate-600">{factor.description}</div>
                            )}
                          </td>
                          {options.map((option) => (
                            <td key={`${option.id}-${factor.id}`} className="p-3 border border-slate-200 text-center">
                              <select 
                                className={`p-2 border rounded-md w-full ${Object.keys(option.ratings).length === 0 && formErrors.optionRatings ? 'border-red-500' : 'border-slate-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
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
                
                <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <button 
                    className="px-4 py-3 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 transition-colors"
                    onClick={handleAddOption}
                  >
                    Add Option
                  </button>
                  <AIButton 
                    onClick={getAiSuggestedOption}
                    operation="option"
                    label="Add Option with AI"
                    disabled={factors.some(f => !f.name)}
                    errorMessage={factors.some(f => !f.name) ? "Name all factors first" : ""}
                  />
                  <AIButton 
                    onClick={getAiDefaultOptions} 
                    operation="defaults" 
                    label="Suggest Default Options" 
                    disabled={factors.some(f => !f.name)}
                    errorMessage={factors.some(f => !f.name) ? "Name all factors first" : ""}
                  />
                  <AIButton 
                    onClick={getAiSuggestedRatings} 
                    operation="ratings" 
                    label="Suggest Ratings with AI" 
                    disabled={options.some(o => !o.name) || factors.some(f => !f.name)}
                    errorMessage={
                      options.some(o => !o.name) && factors.some(f => !f.name) 
                        ? "Name all options and factors first" 
                        : options.some(o => !o.name) 
                          ? "Name all options first" 
                          : factors.some(f => !f.name) 
                            ? "Name all factors first" 
                            : ""
                    }
                    className="col-span-1 sm:col-span-2"
                  />
                </div>
                
                <div className="flex justify-between">
                  <button
                    className="px-5 py-3 bg-slate-100 text-slate-700 rounded-md font-medium hover:bg-slate-200 transition-colors"
                    onClick={goToPrevStep}
                  >
                    Back
                  </button>
                  <div className="flex space-x-3">
                    {user ? (
                      <button 
                        className="px-5 py-3 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 transition-colors"
                        onClick={saveDecision}
                        disabled={isLoadingAI && currentAiOperation === 'saving'}
                      >
                        {isLoadingAI && currentAiOperation === 'saving' ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Saving...
                          </>
                        ) : 'Save Decision'}
                      </button>
                    ) : (
                      <Link 
                        href="/login" 
                        className="px-5 py-3 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 transition-colors"
                        onClick={storePendingDecision}
                      >
                        Log in to Save
                      </Link>
                    )}
                    <button
                      className="px-5 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
                      onClick={goToNextStep}
                    >
                      Next Step
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Step 4: Results */}
            {step === 4 && (
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Decision Results</h2>
                
                {/* Top recommendation */}
                {topOption && (
                  <div className="mb-8 p-6 bg-blue-50 border border-blue-200 rounded-lg shadow-sm">
                    <h3 className="text-xl font-bold mb-3 text-blue-800">Top Recommendation: {topOption.name}</h3>
                    <div className="text-2xl font-bold mb-4 text-blue-600">{topOption.percentageScore}% match</div>
                    
                    {isLoadingAI && currentAiOperation === 'explanation' ? (
                      <div className="text-center p-4">Generating AI explanation...</div>
                    ) : aiExplanation ? (
                      <div className="mt-4">
                        <h4 className="font-semibold text-slate-700 mb-2">AI Explanation:</h4>
                        <p className="mt-2 text-sm sm:text-base text-slate-600 bg-white p-4 rounded-md border border-slate-200">{aiExplanation}</p>
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
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-4 text-slate-800">All Options</h3>
                  
                  {scoredOptions.map((option, index) => {
                    const { strongFactors, weakFactors } = getFactorAnalysis(option);
                    
                    return (
                      <div key={option.id} className="mb-6 p-5 border border-slate-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="text-lg sm:text-xl font-bold text-slate-800 break-words">{index + 1}. {option.name}</h4>
                          <div className="text-lg sm:text-xl font-bold text-blue-600">{option.percentageScore}%</div>
                        </div>
                        
                        {/* Progress bar */}
                        <div className="w-full bg-slate-200 h-5 rounded-full mb-5">
                          <div 
                            className="bg-blue-600 h-5 rounded-full" 
                            style={{ width: `${option.percentageScore}%` }}
                          ></div>
                        </div>
                        
                        {/* Strength/Weakness analysis */}
                        <div className="flex flex-col md:flex-row gap-6">
                          <div className="flex-1">
                            <h5 className="font-semibold text-green-600 mb-2">Strengths:</h5>
                            <ul className="list-disc pl-5 text-sm sm:text-base text-slate-700">
                              {strongFactors.map(({ factor, score, maxScore }) => (
                                <li key={factor.id} className="mb-1">
                                  {factor.name}: {score}/{maxScore} ({Math.round((score/maxScore) * 100)}%)
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="flex-1">
                            <h5 className="font-semibold text-red-600 mb-2">Weaknesses:</h5>
                            <ul className="list-disc pl-5 text-sm sm:text-base text-slate-700">
                              {weakFactors.map(({ factor, score, maxScore }) => (
                                <li key={factor.id} className="mb-1">
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
                    className="px-5 py-3 bg-slate-100 text-slate-700 rounded-md font-medium hover:bg-slate-200 transition-colors"
                    onClick={goToPrevStep}
                  >
                    Back
                  </button>
                  {user ? (
                    <button 
                      className="px-5 py-3 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 transition-colors"
                      onClick={saveDecision}
                      disabled={isLoadingAI && currentAiOperation === 'saving'}
                    >
                      {isLoadingAI && currentAiOperation === 'saving' ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Saving...
                        </>
                      ) : 'Save Decision'}
                    </button>
                  ) : (
                    <Link 
                      href="/login"
                      className="px-5 py-3 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 transition-colors"
                      onClick={storePendingDecision}
                    >
                      Log in to Save
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {/* Footer with branding */}
          <div className="text-center text-slate-500 text-sm py-4">
            <p>Decidr — Clarity when it matters most</p>
          </div>
        </div>
      </div>
    </div>
  );
} 