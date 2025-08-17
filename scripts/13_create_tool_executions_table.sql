-- Create Tool Executions table for tracking API calls and results
CREATE TABLE IF NOT EXISTS tool_executions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    tool_id VARCHAR(100) REFERENCES ai_tools(tool_id),
    execution_id VARCHAR(100) UNIQUE, -- fal.ai request ID
    input_parameters JSONB,
    input_file_url TEXT,
    output_file_url TEXT,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
    credits_used INTEGER DEFAULT 0,
    processing_time_seconds INTEGER,
    error_message TEXT,
    fal_response JSONB, -- store full fal.ai response
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_tool_executions_user_id ON tool_executions(user_id);
CREATE INDEX IF NOT EXISTS idx_tool_executions_tool_id ON tool_executions(tool_id);
CREATE INDEX IF NOT EXISTS idx_tool_executions_status ON tool_executions(status);
CREATE INDEX IF NOT EXISTS idx_tool_executions_created_at ON tool_executions(created_at DESC);
