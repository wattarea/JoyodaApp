-- Create n8n workflows table for managing workflow metadata
CREATE TABLE IF NOT EXISTS n8n_workflows (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  production_url TEXT NOT NULL,
  credit_cost INTEGER NOT NULL DEFAULT 1,
  workflow_tag VARCHAR(100),
  content_type VARCHAR(100),
  category VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  execution_count INTEGER DEFAULT 0,
  last_executed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_n8n_workflows_active ON n8n_workflows(is_active);
CREATE INDEX IF NOT EXISTS idx_n8n_workflows_category ON n8n_workflows(category);
CREATE INDEX IF NOT EXISTS idx_n8n_workflows_created_at ON n8n_workflows(created_at);

-- Insert some sample workflows
INSERT INTO n8n_workflows (name, description, production_url, credit_cost, workflow_tag, content_type, category) VALUES
('Email Notification System', 'Automated email notifications for user actions', 'https://n8n.joyoda.com/webhook/email-notify', 1, 'notification', 'email', 'communication'),
('Image Processing Pipeline', 'Automated image processing and optimization', 'https://n8n.joyoda.com/webhook/image-process', 2, 'automation', 'image', 'processing'),
('User Onboarding Flow', 'Automated user onboarding and welcome sequence', 'https://n8n.joyoda.com/webhook/user-onboard', 1, 'onboarding', 'user', 'automation'),
('Credit Management', 'Automated credit allocation and management', 'https://n8n.joyoda.com/webhook/credit-manage', 1, 'finance', 'credit', 'management');
