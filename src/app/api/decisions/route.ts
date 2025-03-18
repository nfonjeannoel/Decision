import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Define types for the data structure
interface Decision {
  id: string;
  title: string;
  description: string;
  factors: any[];
  options: any[];
  created_at: string;
  user_id: string;
  type?: string;
}

interface TransformedDecision {
  id: string;
  title: string;
  description: string;
  factors: any[];
  options: any[];
  createdAt: string;
  userId: string;
  type?: string;
}

export async function GET(request: NextRequest) {
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
    
    // Get decisions for the authenticated user
    const { data: dbDecisions, error } = await supabaseClient
      .from('decisions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    // Transform to camelCase for client
    const decisions = (dbDecisions || []).map((decision: Decision): TransformedDecision => ({
      id: decision.id,
      title: decision.title,
      description: decision.description,
      factors: decision.factors,
      options: decision.options,
      type: decision.type,
      userId: decision.user_id,
      createdAt: decision.created_at
    }));
    
    return NextResponse.json({ decisions });
  } catch (error) {
    console.error('Error fetching decisions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch decisions', decisions: [] }, 
      { status: 500 }
    );
  }
} 