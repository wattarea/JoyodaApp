-- Create Tool Parameters table for configurable parameters
CREATE TABLE IF NOT EXISTS tool_parameters (
    id SERIAL PRIMARY KEY,
    tool_id VARCHAR(100) REFERENCES ai_tools(tool_id) ON DELETE CASCADE,
    parameter_name VARCHAR(100) NOT NULL,
    parameter_type VARCHAR(50) NOT NULL, -- 'string', 'number', 'boolean', 'select', 'range'
    display_name VARCHAR(200) NOT NULL,
    description TEXT,
    default_value TEXT,
    min_value DECIMAL,
    max_value DECIMAL,
    step_value DECIMAL,
    options JSONB, -- for select type parameters
    is_required BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_tool_parameters_tool_id ON tool_parameters(tool_id);
CREATE INDEX IF NOT EXISTS idx_tool_parameters_order ON tool_parameters(tool_id, display_order);
