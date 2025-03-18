import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
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
    
    if (!id) {
      return NextResponse.json({ error: 'Decision ID is required' }, { status: 400 });
    }
    
    // Fetch the decision from Supabase
    const { data, error } = await supabaseClient
      .from('decisions')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching decision:', error);
      return NextResponse.json({ error: 'Failed to fetch decision' }, { status: 500 });
    }
    
    if (!data) {
      return NextResponse.json({ error: 'Decision not found' }, { status: 404 });
    }
    
    // Check if the decision belongs to the user
    if (data.user_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized to access this decision' }, { status: 403 });
    }
    
    // Transform snake_case to camelCase
    const transformedData = {
      id: data.id,
      title: data.title,
      description: data.description,
      factors: data.factors,
      options: data.options,
      type: data.type,
      userId: data.user_id,
      createdAt: data.created_at
    };
    
    return NextResponse.json(transformedData);
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'Failed to fetch decision' }, 
      { status: 500 }
    );
  }
}

// Add DELETE endpoint to allow decision deletion
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
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
    
    if (!id) {
      return NextResponse.json({ error: 'Decision ID is required' }, { status: 400 });
    }
    
    // First check if the decision exists and belongs to the user
    const { data: decision, error: fetchError } = await supabaseClient
      .from('decisions')
      .select('user_id')
      .eq('id', id)
      .single();
    
    if (fetchError) {
      return NextResponse.json({ error: 'Decision not found' }, { status: 404 });
    }
    
    if (decision.user_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized to delete this decision' }, { status: 403 });
    }
    
    // Delete the decision
    const { error: deleteError } = await supabaseClient
      .from('decisions')
      .delete()
      .eq('id', id);
    
    if (deleteError) {
      console.error('Error deleting decision:', deleteError);
      return NextResponse.json({ error: 'Failed to delete decision' }, { status: 500 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing delete request:', error);
    return NextResponse.json(
      { error: 'Failed to delete decision' }, 
      { status: 500 }
    );
  }
}

// Add PATCH endpoint to update decision properties
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
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
    
    if (!id) {
      return NextResponse.json({ error: 'Decision ID is required' }, { status: 400 });
    }
    
    // First check if the decision exists and belongs to the user
    const { data: decision, error: fetchError } = await supabaseClient
      .from('decisions')
      .select('user_id')
      .eq('id', id)
      .single();
    
    if (fetchError) {
      return NextResponse.json({ error: 'Decision not found' }, { status: 404 });
    }
    
    if (decision.user_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized to update this decision' }, { status: 403 });
    }
    
    // Get update data from request
    const updateData = await request.json();
    
    // Validate update data
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No update data provided' }, { status: 400 });
    }
    
    // Only allow specific fields to be updated
    const validUpdateFields = ['title', 'description', 'type'];
    const cleanUpdateData: Record<string, any> = {};
    
    for (const field of validUpdateFields) {
      if (field in updateData) {
        cleanUpdateData[field] = updateData[field];
      }
    }
    
    // Update the decision
    const { data: updatedDecision, error: updateError } = await supabaseClient
      .from('decisions')
      .update(cleanUpdateData)
      .eq('id', id)
      .select('*')
      .single();
    
    if (updateError) {
      console.error('Error updating decision:', updateError);
      return NextResponse.json({ error: 'Failed to update decision' }, { status: 500 });
    }
    
    // Transform snake_case to camelCase for response
    const transformedData = {
      id: updatedDecision.id,
      title: updatedDecision.title,
      description: updatedDecision.description,
      factors: updatedDecision.factors,
      options: updatedDecision.options,
      type: updatedDecision.type,
      userId: updatedDecision.user_id,
      createdAt: updatedDecision.created_at
    };
    
    return NextResponse.json(transformedData);
  } catch (error) {
    console.error('Error processing update request:', error);
    return NextResponse.json(
      { error: 'Failed to update decision' }, 
      { status: 500 }
    );
  }
} 