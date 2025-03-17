import { NextRequest, NextResponse } from 'next/server';
import { generateExplanation } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    const { decision, topOption } = await request.json();
    
    if (!decision || !topOption) {
      return NextResponse.json(
        { error: 'Decision data and top option are required' }, 
        { status: 400 }
      );
    }
    
    const explanation = await generateExplanation(decision, topOption);
    
    return NextResponse.json({ explanation });
  } catch (error) {
    console.error('Error in explain API route:', error);
    return NextResponse.json(
      { error: 'Failed to generate explanation' }, 
      { status: 500 }
    );
  }
} 