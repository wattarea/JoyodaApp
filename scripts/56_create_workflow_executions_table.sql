CREATE TABLE IF NOT EXISTS workflow_executions (
  -- Changed id from UUID to SERIAL to match users table pattern
  id SERIAL PRIMARY KEY,
  -- Changed user_id from UUID to INTEGER to match users table id type
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  workflow_type VARCHAR(100) NOT NULL,
  workflow_name VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending', -- pending, processing, completed, failed
  input_data JSONB NOT NULL,
  output_data JSONB,
  video_url TEXT,
  thumbnail_url TEXT,
  credits_used INTEGER NOT NULL,
  execution_time_seconds INTEGER,
  error_message TEXT,
  n8n_execution_id VARCHAR(255),
  webhook_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_workflow_executions_user_id ON workflow_executions(user_id);
CREATE INDEX IF NOT EXISTS idx_workflow_executions_status ON workflow_executions(status);
CREATE INDEX IF NOT EXISTS idx_workflow_executions_created_at ON workflow_executions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_workflow_executions_n8n_id ON workflow_executions(n8n_execution_id);

-- Removed invalid </sql> closing tag that was causing syntax error
-- The application will handle access control through server-side logic
