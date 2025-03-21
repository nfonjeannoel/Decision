'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { getConsistentUnsplashImage, getDailyUnsplashImage } from '@/lib/unsplashService';

export default function HowItWorks() {
  // Define image URLs for each step
  const [imageUrls, setImageUrls] = useState({
    banner: '',
    decisionType: '',
    factorAnalysis: '',
    optionsAnalysis: '',
    recommendation: ''
  });

  useEffect(() => {
    // Get consistent images for each step to ensure they don't change on rerenders
    setImageUrls({
      banner: getDailyUnsplashImage(),
      decisionType: getConsistentUnsplashImage('decision making choice options selection'),
      factorAnalysis: getConsistentUnsplashImage('analysis strategy priority planning'),
      optionsAnalysis: getConsistentUnsplashImage('comparison data analytics visualization'),
      recommendation: getConsistentUnsplashImage('solution recommendation success achievement')
    });
  }, []);

  return (
    <main className="min-h-screen flex flex-col">
      <div className="relative">
        {/* Banner Image */}
        {imageUrls.banner ? (
          <div className="relative h-[400px] w-full">
            <Image 
              src={imageUrls.banner} 
              alt="Decision making process" 
              fill 
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary-light/90 to-secondary-dark/80"></div>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-primary-light to-secondary-dark h-[400px]"></div>
        )}
        
        {/* Overlaid content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="max-w-4xl mx-auto text-center px-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-8">
              How Decidr Works
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Our intelligent decision engine combines AI analysis with your unique 
              priorities to help you make confident choices.
            </p>
          </div>
        </div>
      </div>

      <section className="py-16 px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="bg-primary/10 text-primary font-semibold px-4 py-2 rounded-full inline-block mb-4">
                Step 1
              </div>
              <h2 className="text-3xl font-bold mb-6">Define Your Decision</h2>
              <p className="text-gray-700 text-lg mb-6">
                Start by selecting a decision type or creating a custom framework. 
                Whether you're choosing between job offers, deciding on a major purchase, 
                or making a life change, we'll guide you through the process.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-primary mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Choose from decision templates</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-primary mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Set a clear decision goal</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-primary mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Specify your timeline</span>
                </li>
              </ul>
            </div>
            <div className="glass-card p-8 rounded-xl overflow-hidden">
              {imageUrls.decisionType ? (
                <div className="relative h-64 w-full rounded-lg overflow-hidden">
                  <Image 
                    src={imageUrls.decisionType} 
                    alt="Decision Type Selection Interface" 
                    fill 
                    className="object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white font-medium text-lg">
                    Decision Type Selection
                  </div>
                </div>
              ) : (
                <div className="bg-gray-100 rounded-lg p-8 shadow-inner">
                  <div className="h-64 flex items-center justify-center text-gray-400">
                    Loading image...
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1 glass-card p-8 rounded-xl overflow-hidden">
              {imageUrls.factorAnalysis ? (
                <div className="relative h-64 w-full rounded-lg overflow-hidden">
                  <Image 
                    src={imageUrls.factorAnalysis} 
                    alt="Factor Analysis Interface" 
                    fill 
                    className="object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white font-medium text-lg">
                    Factor Analysis
                  </div>
                </div>
              ) : (
                <div className="bg-gray-100 rounded-lg p-8 shadow-inner">
                  <div className="h-64 flex items-center justify-center text-gray-400">
                    Loading image...
                  </div>
                </div>
              )}
            </div>
            <div className="order-1 md:order-2">
              <div className="bg-secondary/10 text-secondary font-semibold px-4 py-2 rounded-full inline-block mb-4">
                Step 2
              </div>
              <h2 className="text-3xl font-bold mb-6">Identify What Matters</h2>
              <p className="text-gray-700 text-lg mb-6">
                Our AI helps you discover the factors that are most important for your 
                specific decision. Rate each factor's importance to create a weighted 
                decision framework that's uniquely yours.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-secondary mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Discover relevant factors</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-secondary mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Weight your priorities</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-secondary mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Consider personal values</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="bg-primary/10 text-primary font-semibold px-4 py-2 rounded-full inline-block mb-4">
                Step 3
              </div>
              <h2 className="text-3xl font-bold mb-6">Analyze Your Options</h2>
              <p className="text-gray-700 text-lg mb-6">
                Enter your options and our system will analyze them against your weighted 
                factors. Our visualizations make it easy to compare alternatives and see 
                which options best align with what matters to you.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-primary mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Rate options against factors</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-primary mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">View side-by-side comparisons</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-primary mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Identify strengths and weaknesses</span>
                </li>
              </ul>
            </div>
            <div className="glass-card p-8 rounded-xl overflow-hidden">
              {imageUrls.optionsAnalysis ? (
                <div className="relative h-64 w-full rounded-lg overflow-hidden">
                  <Image 
                    src={imageUrls.optionsAnalysis} 
                    alt="Options Analysis Interface" 
                    fill 
                    className="object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white font-medium text-lg">
                    Options Analysis
                  </div>
                </div>
              ) : (
                <div className="bg-gray-100 rounded-lg p-8 shadow-inner">
                  <div className="h-64 flex items-center justify-center text-gray-400">
                    Loading image...
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1 glass-card p-8 rounded-xl overflow-hidden">
              {imageUrls.recommendation ? (
                <div className="relative h-64 w-full rounded-lg overflow-hidden">
                  <Image 
                    src={imageUrls.recommendation} 
                    alt="Recommendation Interface" 
                    fill 
                    className="object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white font-medium text-lg">
                    Recommendation Dashboard
                  </div>
                </div>
              ) : (
                <div className="bg-gray-100 rounded-lg p-8 shadow-inner">
                  <div className="h-64 flex items-center justify-center text-gray-400">
                    Loading image...
                  </div>
                </div>
              )}
            </div>
            <div className="order-1 md:order-2">
              <div className="bg-secondary/10 text-secondary font-semibold px-4 py-2 rounded-full inline-block mb-4">
                Step 4
              </div>
              <h2 className="text-3xl font-bold mb-6">Get Clear Recommendations</h2>
              <p className="text-gray-700 text-lg mb-6">
                Receive personalized recommendations based on your unique priorities. 
                We'll explain our reasoning in plain language and show you why each 
                option ranked as it did.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-secondary mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Get ranked recommendations</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-secondary mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Understand the reasoning</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-secondary mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Explore alternative scenarios</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-8 bg-gradient-to-br from-primary-light to-secondary-dark text-white text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">Ready to Make a Better Decision?</h2>
          <p className="text-xl text-white/80 mb-10">
            Join thousands of others who have found clarity through our intelligent decision process.
          </p>
          <Link 
            href="/decisions/new" 
            className="bg-white text-primary hover:bg-white/90 font-semibold text-lg px-8 py-4 rounded-lg transition-colors inline-block"
          >
            Start a Decision Now
          </Link>
        </div>
      </section>
    </main>
  );
} 