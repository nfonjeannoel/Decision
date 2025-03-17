import { NextRequest, NextResponse } from 'next/server';
import { getSuggestedFactors } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    const { decisionType, description } = await request.json();
    
    if (!decisionType) {
      return NextResponse.json({ error: 'Decision type is required' }, { status: 400 });
    }
    
    const factors = await getSuggestedFactors(decisionType, description);
    
    return NextResponse.json({ factors });
  } catch (error) {
    console.error('Error in factors API route:', error);
    return NextResponse.json(
      { error: 'Failed to get factor suggestions' }, 
      { status: 500 }
    );
  }
} 