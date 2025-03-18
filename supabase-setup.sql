-- Create the decisions table
CREATE TABLE decisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  factors JSONB NOT NULL,
  options JSONB NOT NULL,
  type TEXT DEFAULT 'custom',
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE decisions ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Policy to allow users to view their own data
CREATE POLICY "Users can view their own decisions" 
  ON decisions 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Policy to allow users to insert their own data
CREATE POLICY "Users can insert their own decisions" 
  ON decisions 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Policy to allow users to update their own data
CREATE POLICY "Users can update their own decisions" 
  ON decisions 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Policy to allow users to delete their own data
CREATE POLICY "Users can delete their own decisions" 
  ON decisions 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_decisions_user_id ON decisions(user_id);
CREATE INDEX idx_decisions_created_at ON decisions(created_at); 