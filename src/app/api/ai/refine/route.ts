import { NextRequest, NextResponse } from 'next/server';
import { refineDecision } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    const { title, description } = await request.json();
    
    if (!title || !description) {
      return NextResponse.json({ error: 'Title and description are required' }, { status: 400 });
    }
    
    const refinedDecision = await refineDecision(title, description);
    
    return NextResponse.json(refinedDecision);
  } catch (error) {
    console.error('Error in refine API route:', error);
    return NextResponse.json(
      { error: 'Failed to refine decision' }, 
      { status: 500 }
    );
  }
} 