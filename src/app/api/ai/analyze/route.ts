import { NextRequest, NextResponse } from 'next/server';
import { analyzeOptions } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    const decision = await request.json();
    
    if (!decision.options || !decision.factors) {
      return NextResponse.json(
        { error: 'Decision options and factors are required' }, 
        { status: 400 }
      );
    }
    
    const insights = await analyzeOptions(decision);
    
    return NextResponse.json({ insights });
  } catch (error) {
    console.error('Error in analyze API route:', error);
    return NextResponse.json(
      { error: 'Failed to analyze options' }, 
      { status: 500 }
    );
  }
} 