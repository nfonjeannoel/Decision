import { NextRequest, NextResponse } from 'next/server';
import { suggestNewFactor } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    const { decisionType, description, existingFactors, title } = await request.json();
    
    if (!decisionType) {
      return NextResponse.json({ error: 'Decision type is required' }, { status: 400 });
    }
    
    const result = await suggestNewFactor(decisionType, description, title, existingFactors);
    
    if (!result.factor) {
      return NextResponse.json(
        { error: 'Failed to generate a new factor' }, 
        { status: 400 }
      );
    }
    
    return NextResponse.json({ factor: result.factor });
  } catch (error) {
    console.error('Error in factor API route:', error);
    return NextResponse.json(
      { error: 'Failed to get factor suggestion' }, 
      { status: 500 }
    );
  }
} 