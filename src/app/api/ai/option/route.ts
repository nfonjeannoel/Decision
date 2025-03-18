import { NextRequest, NextResponse } from 'next/server';
import { suggestOptions } from '@/lib/openai';
import OpenAI from 'openai';

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: false,
});

export async function POST(request: NextRequest) {
  try {
    const { title, description, factors, existingOptions } = await request.json();
    
    if (!factors || !Array.isArray(factors) || factors.length === 0) {
      return NextResponse.json({ error: 'Valid factors array is required' }, { status: 400 });
    }
    
    // Request a single option suggestion - but let's implement it directly here
    // to account for existing options
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are an AI assistant helping users generate relevant options for their decision. Your task is to suggest ONE specific, contextually appropriate option based on the decision details."
          },
          {
            role: "user", 
            content: `I'm making a decision with the following information:
                     Title: ${title}
                     Description: ${description}
                     Factors: ${JSON.stringify(factors)}
                     
                     I already have these options: ${existingOptions ? JSON.stringify(existingOptions) : "[]"}
                     
                     Please suggest ONE new, specific option that is different from my existing options.
                     Return a JSON object with the option name.
                     Format: {optionName: string}`
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
      });
      
      const result = JSON.parse(response.choices[0].message.content || '{"optionName": ""}');
      
      if (result.optionName) {
        return NextResponse.json({ optionName: result.optionName });
      } else {
        return NextResponse.json({ error: 'Could not generate a suitable option' }, { status: 400 });
      }
    } catch (openaiError) {
      console.error('OpenAI API error:', openaiError);
      return NextResponse.json({ error: 'Failed to generate option with AI' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in single option API route:', error);
    return NextResponse.json(
      { error: 'Failed to suggest option' }, 
      { status: 500 }
    );
  }
} 