'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

// Type definitions
type Factor = {
  id: string;
  name: string;
  weight: number;
  description: string;
};

type Ratings = {
  [factorId: string]: number;
};

type Option = {
  id: string;
  name: string;
  score: number;
  ratings: Ratings;
  notes: string;
};

type Decision = {
  id: string;
  title: string;
  type: string;
  date: string;
  description: string;
  factors: Factor[];
  options: Option[];
};

type DecisionData = {
  [key: string]: Decision;
};

// Mock data for a single decision
const mockDecisionData: DecisionData = {
  dec1: {
    id: 'dec1',
    title: 'Job Offer Comparison',
    type: 'career',
    date: '2025-03-12',
    description: 'Evaluating two job offers based on compensation, growth potential, and work-life balance.',
    factors: [
      { id: 'salary', name: 'Salary', weight: 4, description: 'Annual compensation including bonuses' },
      { id: 'growth', name: 'Growth Potential', weight: 3, description: 'Opportunities for advancement and skill development' },
      { id: 'balance', name: 'Work-Life Balance', weight: 3, description: 'Flexibility and time for personal life' },
      { id: 'culture', name: 'Company Culture', weight: 2, description: 'Work environment and team dynamics' },
      { id: 'location', name: 'Location', weight: 2, description: 'Commute, area desirability, and cost of living' },
      { id: 'benefits', name: 'Benefits', weight: 1, description: 'Healthcare, retirement, and other perks' },
    ],
    options: [
      { 
        id: 'option1', 
        name: 'Company A', 
        score: 87,
        ratings: {
          salary: 5,
          growth: 4,
          balance: 3,
          culture: 5,
          location: 4,
          benefits: 3,
        },
        notes: 'Established company with great reputation. Higher salary but potentially longer hours.'
      },
      { 
        id: 'option2', 
        name: 'Company B', 
        score: 72,
        ratings: {
          salary: 3,
          growth: 5,
          balance: 4,
          culture: 3,
          location: 2,
          benefits: 4,
        },
        notes: 'Startup with exciting growth potential but lower initial compensation. Better work-life balance.'
      },
    ],
  },
  dec2: {
    id: 'dec2',
    title: 'Apartment Selection',
    type: 'life',
    date: '2025-03-05',
    description: 'Deciding on a new apartment based on location, price, and amenities.',
    factors: [
      { id: 'price', name: 'Price', weight: 5, description: 'Monthly rent and utilities' },
      { id: 'location', name: 'Location', weight: 4, description: 'Proximity to work and amenities' },
      { id: 'space', name: 'Space', weight: 3, description: 'Square footage and layout' },
      { id: 'amenities', name: 'Amenities', weight: 2, description: 'Building features like gym, pool, etc.' },
      { id: 'neighborhood', name: 'Neighborhood', weight: 3, description: 'Safety, restaurants, nightlife' },
    ],
    options: [
      { 
        id: 'option1', 
        name: 'Downtown Loft', 
        score: 84,
        ratings: {
          price: 3,
          location: 5,
          space: 3,
          amenities: 5,
          neighborhood: 5,
        },
        notes: 'Great location with lots of dining and entertainment options. More expensive but excellent amenities.'
      },
      { 
        id: 'option2', 
        name: 'Suburban Townhouse', 
        score: 90,
        ratings: {
          price: 4,
          location: 3,
          space: 5,
          amenities: 4,
          neighborhood: 4,
        },
        notes: 'More space for the money and quieter environment. Longer commute to work.'
      },
      { 
        id: 'option3', 
        name: 'Midtown Apartment', 
        score: 76,
        ratings: {
          price: 3,
          location: 4,
          space: 2,
          amenities: 3,
          neighborhood: 4,
        },
        notes: 'Good compromise on location but smaller space. Decent amenities.'
      },
    ],
  },
  dec3: {
    id: 'dec3',
    title: 'Car Purchase',
    type: 'purchase',
    date: '2025-02-23',
    description: 'Selecting a new vehicle based on price, features, and efficiency.',
    factors: [
      { id: 'price', name: 'Price', weight: 5, description: 'Purchase price and financing terms' },
      { id: 'efficiency', name: 'Fuel Efficiency', weight: 4, description: 'Miles per gallon or electric range' },
      { id: 'features', name: 'Features', weight: 3, description: 'Technology, comfort, and safety features' },
      { id: 'reliability', name: 'Reliability', weight: 4, description: 'Expected maintenance and durability' },
      { id: 'style', name: 'Style', weight: 2, description: 'Appearance and design' },
    ],
    options: [
      { 
        id: 'option1', 
        name: 'Tesla Model 3', 
        score: 82,
        ratings: {
          price: 2,
          efficiency: 5,
          features: 5,
          reliability: 3,
          style: 5,
        },
        notes: 'Electric vehicle with cutting-edge technology. Higher upfront cost but lower operating costs.'
      },
      { 
        id: 'option2', 
        name: 'Toyota Camry', 
        score: 88,
        ratings: {
          price: 4,
          efficiency: 4,
          features: 3,
          reliability: 5,
          style: 3,
        },
        notes: 'Extremely reliable with good fuel efficiency. Not as exciting but practical choice.'
      },
      { 
        id: 'option3', 
        name: 'Honda Accord', 
        score: 79,
        ratings: {
          price: 4,
          efficiency: 4,
          features: 3,
          reliability: 4,
          style: 2,
        },
        notes: 'Similar to the Camry but slightly less reliable historically. Good value overall.'
      },
    ],
  },
};

export default function DecisionDetail() {
  const params = useParams();
  const router = useRouter();
  const [decision, setDecision] = useState<Decision | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('summary');
  
  useEffect(() => {
    // In a real app, this would be an API call
    const id = params.id;
    if (typeof id !== 'string' || !mockDecisionData[id]) {
      router.push('/dashboard');
      return;
    }
    
    setDecision(mockDecisionData[id]);
    setLoading(false);
  }, [params.id, router]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading decision...</p>
        </div>
      </div>
    );
  }
  
  if (!decision) {
    return null; // This should not happen as we redirect in the useEffect
  }
  
  // Get the top option (highest score)
  const topOption = [...decision.options].sort((a, b) => b.score - a.score)[0];
  
  // Get type label
  const getTypeLabel = (type: string): string => {
    switch (type) {
      case 'career': return 'Career Decision';
      case 'life': return 'Life Change';
      case 'purchase': return 'Major Purchase';
      default: return 'Custom Decision';
    }
  };
  
  // Generate factor strengths and weaknesses for an option
  const getFactorAnalysis = (option: Option) => {
    const strengths = decision.factors
      .filter(factor => (option.ratings[factor.id] || 0) >= 4)
      .sort((a, b) => b.weight - a.weight)
      .slice(0, 3);
      
    const weaknesses = decision.factors
      .filter(factor => (option.ratings[factor.id] || 0) <= 2 && (option.ratings[factor.id] || 0) > 0)
      .sort((a, b) => b.weight - a.weight)
      .slice(0, 3);
      
    return { strengths, weaknesses };
  };
  
  return (
    <main className="min-h-screen flex flex-col">
      <div className="bg-gradient-to-br from-primary-light to-secondary-dark py-8 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-white/80 mb-2">
                <Link href="/dashboard" className="hover:text-white">
                  Dashboard
                </Link>
                <span>›</span>
                <span>{getTypeLabel(decision.type)}</span>
              </div>
              <h1 className="text-3xl font-bold text-white">
                {decision.title}
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="text-white/80 hover:text-white flex items-center gap-1">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                  <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                </svg>
                <span>Edit</span>
              </button>
              
              <button className="text-white/80 hover:text-white flex items-center gap-1">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-8">
          <div className="flex overflow-x-auto">
            <button
              className={`py-4 px-6 font-medium text-sm border-b-2 ${
                activeTab === 'summary' 
                  ? 'border-primary text-primary' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('summary')}
            >
              Summary
            </button>
            <button
              className={`py-4 px-6 font-medium text-sm border-b-2 ${
                activeTab === 'factors' 
                  ? 'border-primary text-primary' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('factors')}
            >
              Factors
            </button>
            <button
              className={`py-4 px-6 font-medium text-sm border-b-2 ${
                activeTab === 'compare' 
                  ? 'border-primary text-primary' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('compare')}
            >
              Compare Options
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 py-12 px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          {/* Summary Tab */}
          {activeTab === 'summary' && (
            <div>
              <div className="mb-10">
                <h2 className="text-2xl font-bold mb-2">Decision Summary</h2>
                <p className="text-gray-600">{decision.description}</p>
                <div className="mt-4 text-sm text-gray-500">
                  Made on {decision.date}
                </div>
              </div>
              
              <div className="mb-10">
                <h2 className="text-2xl font-bold mb-6">Recommendation</h2>
                
                <div className="glass-card p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-primary mb-1">
                        Recommended Option
                      </div>
                      <h3 className="text-2xl font-bold">{topOption.name}</h3>
                      <div className="text-gray-500 mt-1">Match score: {topOption.score}%</div>
                    </div>
                  </div>
                  
                  <div className="h-2 bg-gray-200 rounded-full mb-6">
                    <div 
                      className="h-2 bg-primary rounded-full" 
                      style={{ width: `${topOption.score}%` }}
                    ></div>
                  </div>
                  
                  {topOption.notes && (
                    <div className="mb-6">
                      <h4 className="font-medium mb-2">Notes</h4>
                      <p className="text-gray-600">{topOption.notes}</p>
                    </div>
                  )}
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    {(() => {
                      const { strengths, weaknesses } = getFactorAnalysis(topOption);
                      
                      return (
                        <>
                          <div>
                            <h4 className="font-medium text-gray-700 mb-2">Key Strengths</h4>
                            {strengths.length > 0 ? (
                              <ul className="space-y-2">
                                {strengths.map(factor => (
                                  <li key={factor.id} className="flex items-start">
                                    <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <div>
                                      <span className="font-medium">{factor.name}</span>
                                      <span className="text-sm text-gray-500 ml-2">
                                        (Rated {topOption.ratings[factor.id]}/5)
                                      </span>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-gray-500 italic">No notable strengths</p>
                            )}
                          </div>
                          
                          <div>
                            <h4 className="font-medium text-gray-700 mb-2">Considerations</h4>
                            {weaknesses.length > 0 ? (
                              <ul className="space-y-2">
                                {weaknesses.map(factor => (
                                  <li key={factor.id} className="flex items-start">
                                    <svg className="w-5 h-5 text-amber-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    <div>
                                      <span className="font-medium">{factor.name}</span>
                                      <span className="text-sm text-gray-500 ml-2">
                                        (Rated {topOption.ratings[factor.id]}/5)
                                      </span>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-gray-500 italic">No significant concerns</p>
                            )}
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>
              
              <div>
                <h2 className="text-2xl font-bold mb-6">All Options</h2>
                
                <div className="grid gap-4">
                  {decision.options
                    .sort((a, b) => b.score - a.score)
                    .map((option, index) => (
                      <div key={option.id} className="glass-card p-4 flex items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                          index === 0 ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{option.name}</h3>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-lg">{option.score}%</div>
                          <div className="text-xs text-gray-500">match score</div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
          
          {/* Factors Tab */}
          {activeTab === 'factors' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Decision Factors</h2>
              <p className="text-gray-600 mb-8">
                These are the factors you considered important in making this decision.
                The weight indicates how important each factor was in the overall calculation.
              </p>
              
              <div className="space-y-4">
                {decision.factors
                  .sort((a, b) => b.weight - a.weight)
                  .map(factor => (
                    <div key={factor.id} className="glass-card p-6">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-medium">{factor.name}</h3>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map(w => (
                            <div 
                              key={w} 
                              className={`w-6 h-6 rounded-full flex items-center justify-center mx-0.5 text-sm ${
                                w <= factor.weight 
                                  ? 'bg-primary text-white' 
                                  : 'bg-gray-200 text-gray-400'
                              }`}
                            >
                              {w}
                            </div>
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600">{factor.description}</p>
                    </div>
                  ))}
              </div>
            </div>
          )}
          
          {/* Compare Tab */}
          {activeTab === 'compare' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Compare Options</h2>
              <p className="text-gray-600 mb-8">
                See how each option compares across all factors.
              </p>
              
              <div className="overflow-x-auto glass-card">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="py-4 px-6 text-left font-medium text-gray-500">Factor</th>
                      <th className="py-4 px-6 text-left font-medium text-gray-500">Weight</th>
                      {decision.options.map(option => (
                        <th key={option.id} className="py-4 px-6 text-left font-medium text-gray-500">
                          {option.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {decision.factors.map(factor => (
                      <tr key={factor.id} className="border-t border-gray-200">
                        <td className="py-4 px-6 font-medium">
                          {factor.name}
                          <div className="text-xs text-gray-500">{factor.description}</div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map(w => (
                              <div 
                                key={w} 
                                className={`w-5 h-5 rounded-full flex items-center justify-center mx-0.5 text-xs ${
                                  w <= factor.weight 
                                    ? 'bg-primary text-white' 
                                    : 'bg-gray-200 text-gray-400'
                                }`}
                              >
                                {w}
                              </div>
                            ))}
                          </div>
                        </td>
                        {decision.options.map(option => (
                          <td key={option.id} className="py-4 px-6">
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map(r => (
                                <div 
                                  key={r} 
                                  className={`w-8 h-8 rounded-md flex items-center justify-center mx-0.5 ${
                                    (option.ratings[factor.id] || 0) === r
                                      ? 'bg-primary text-white' 
                                      : 'bg-gray-100 text-gray-400'
                                  }`}
                                >
                                  {r}
                                </div>
                              ))}
                            </div>
                          </td>
                        ))}
                      </tr>
                    ))}
                    <tr className="border-t border-gray-200 font-bold bg-gray-50">
                      <td className="py-4 px-6">Final Score</td>
                      <td className="py-4 px-6"></td>
                      {decision.options.map(option => (
                        <td key={option.id} className="py-4 px-6 text-primary text-lg">
                          {option.score}%
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
} 