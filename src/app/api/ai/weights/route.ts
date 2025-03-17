import { NextRequest, NextResponse } from 'next/server';
import { suggestFactorWeights } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    const { title, description, factors } = await request.json();
    
    if (!factors || !Array.isArray(factors) || factors.length === 0) {
      return NextResponse.json({ error: 'Valid factors array is required' }, { status: 400 });
    }
    
    const result = await suggestFactorWeights(title, description, factors);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in weights API route:', error);
    return NextResponse.json(
      { error: 'Failed to suggest weights' }, 
      { status: 500 }
    );
  }
} 