-- Create AI Tools table for dynamic tool management
CREATE TABLE IF NOT EXISTS ai_tools (
    id SERIAL PRIMARY KEY,
    tool_id VARCHAR(100) UNIQUE NOT NULL, -- e.g., 'background-remover', 'text-to-image'
    name VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL, -- 'enhancement', 'editing', 'artistic', 'repair', 'generation'
    fal_model_id VARCHAR(200), -- e.g., 'fal-ai/stable-diffusion-xl-lightning'
    api_provider VARCHAR(50) DEFAULT 'fal', -- 'fal', 'openai', 'custom'
    icon_name VARCHAR(100), -- icon identifier for UI
    credits_per_use INTEGER NOT NULL DEFAULT 1,
    processing_time_estimate INTEGER DEFAULT 30, -- seconds
    max_file_size_mb INTEGER DEFAULT 10,
    supported_formats JSONB DEFAULT '["png", "jpg", "jpeg"]',
    input_parameters JSONB DEFAULT '{}', -- tool-specific parameters
    output_format VARCHAR(20) DEFAULT 'png',
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    rating DECIMAL(3,2) DEFAULT 0.0,
    usage_count INTEGER DEFAULT 0,
    success_rate DECIMAL(5,2) DEFAULT 100.0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_ai_tools_category ON ai_tools(category);
CREATE INDEX IF NOT EXISTS idx_ai_tools_active ON ai_tools(is_active);
CREATE INDEX IF NOT EXISTS idx_ai_tools_featured ON ai_tools(is_featured);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_ai_tools_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_ai_tools_updated_at
    BEFORE UPDATE ON ai_tools
    FOR EACH ROW
    EXECUTE FUNCTION update_ai_tools_updated_at();
