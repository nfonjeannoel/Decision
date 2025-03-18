import { NextRequest, NextResponse } from 'next/server';
import { suggestOptions } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    const { title, description, factors, count } = await request.json();
    
    if (!factors || !Array.isArray(factors) || factors.length === 0) {
      return NextResponse.json({ error: 'Valid factors array is required' }, { status: 400 });
    }
    
    const result = await suggestOptions(title, description, factors, count || 2);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in options API route:', error);
    return NextResponse.json(
      { error: 'Failed to suggest options' }, 
      { status: 500 }
    );
  }
} 