-- Create workshops table
CREATE TABLE IF NOT EXISTS workshops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  total_quota INTEGER NOT NULL CHECK (total_quota > 0),
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create registrations table
CREATE TABLE IF NOT EXISTS registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  workshop_id UUID NOT NULL REFERENCES workshops(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('PENDING', 'CONFIRMED', 'CANCELLED')) DEFAULT 'CONFIRMED',
  registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, workshop_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_registrations_user_id ON registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_registrations_workshop_id ON registrations(workshop_id);
CREATE INDEX IF NOT EXISTS idx_registrations_status ON registrations(status);
CREATE INDEX IF NOT EXISTS idx_workshops_is_active ON workshops(is_active);

-- Enable Row Level Security
ALTER TABLE workshops ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for workshops table
-- Everyone can view active workshops
CREATE POLICY "workshops_select_all" 
  ON workshops FOR SELECT 
  USING (is_active = true);

-- Only authenticated users can view all workshops (including inactive)
CREATE POLICY "workshops_select_auth" 
  ON workshops FOR SELECT 
  USING (auth.uid() IS NOT NULL);

-- RLS Policies for registrations table
-- Users can view their own registrations
CREATE POLICY "registrations_select_own" 
  ON registrations FOR SELECT 
  USING (auth.uid() = user_id);

-- Users can insert their own registrations
CREATE POLICY "registrations_insert_own" 
  ON registrations FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own registrations (for cancellation)
CREATE POLICY "registrations_update_own" 
  ON registrations FOR UPDATE 
  USING (auth.uid() = user_id);

-- Users can delete their own registrations
CREATE POLICY "registrations_delete_own" 
  ON registrations FOR DELETE 
  USING (auth.uid() = user_id);
