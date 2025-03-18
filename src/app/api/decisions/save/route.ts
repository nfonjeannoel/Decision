import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// AI function to determine decision category
async function categorizeDecision(title: string, description: string, factors: any[], options: any[]): Promise<string> {
  try {
    // Prepare text content for analysis
    const factorNames = factors.map(f => f.name).join(', ');
    const optionNames = options.map(o => o.name).join(', ');
    
    const content = `
      Title: ${title}
      Description: ${description}
      Factors: ${factorNames}
      Options: ${optionNames}
    `;
    
    // Create pattern matching for common decision types
    const patterns = {
      career: /job|career|work|profession|salary|interview|role|position|hire|promotion|company|employer|resume|cv|office/i,
      purchase: /buy|price|cost|purchase|spend|money|budget|dollar|investment|car|house|home|property|product|item|afford/i,
      life: /move|marriage|relationship|family|child|children|education|school|university|college|health|medical|lifestyle|living|relocate|travel/i
    };
    
    // Check which pattern has the most matches in the content
    let bestMatch = 'custom';
    let highestScore = 0;
    
    for (const [category, pattern] of Object.entries(patterns)) {
      const matches = content.match(pattern);
      const score = matches ? matches.length : 0;
      
      if (score > highestScore) {
        highestScore = score;
        bestMatch = category;
      }
    }
    
    // Only categorize if we have a good match
    if (highestScore >= 2) {
      return bestMatch;
    }
    
    return 'custom';
  } catch (error) {
    console.error('Error categorizing decision:', error);
    return 'custom'; // Default to custom on error
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get authorization header from the request
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Create Supabase client with the auth token
    const supabaseClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      }
    );
    
    // Get the user data
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    
    const decisionData = await request.json();
    
    if (!decisionData.title) {
      return NextResponse.json({ error: 'Decision title is required' }, { status: 400 });
    }
    
    // Auto-categorize the decision if no type is provided
    let decisionType = decisionData.type;
    if (!decisionType || decisionType === 'custom') {
      decisionType = await categorizeDecision(
        decisionData.title, 
        decisionData.description || '', 
        decisionData.factors || [], 
        decisionData.options || []
      );
    }
    
    // Format the decision data for Supabase
    const decision = {
      title: decisionData.title,
      description: decisionData.description || '',
      factors: decisionData.factors || [],
      options: decisionData.options || [],
      type: decisionType,
      user_id: user.id,
      created_at: new Date().toISOString()
    };
    
    // Insert the decision into Supabase
    const { data, error } = await supabaseClient
      .from('decisions')
      .insert([decision])
      .select('*')
      .single();
    
    if (error) {
      throw error;
    }
    
    return NextResponse.json({ success: true, decision: data });
  } catch (error) {
    console.error('Error saving decision:', error);
    return NextResponse.json(
      { error: 'Failed to save decision' }, 
      { status: 500 }
    );
  }
} 