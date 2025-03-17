import { NextRequest, NextResponse } from 'next/server';
import { suggestOptionRatings } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    const { title, description, factors, options } = await request.json();
    
    if (!factors || !Array.isArray(factors) || factors.length === 0) {
      return NextResponse.json({ error: 'Valid factors array is required' }, { status: 400 });
    }
    
    if (!options || !Array.isArray(options) || options.length === 0) {
      return NextResponse.json({ error: 'Valid options array is required' }, { status: 400 });
    }
    
    const result = await suggestOptionRatings(title, description, factors, options);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in ratings API route:', error);
    return NextResponse.json(
      { error: 'Failed to suggest ratings' }, 
      { status: 500 }
    );
  }
} 