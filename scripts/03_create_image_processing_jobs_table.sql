-- Create image_processing_jobs table for tracking AI tool usage and results
CREATE TABLE IF NOT EXISTS image_processing_jobs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tool_id VARCHAR(100) NOT NULL,
    tool_name VARCHAR(255) NOT NULL,
    input_image_url TEXT,
    output_image_url TEXT,
    input_file_size INTEGER, -- Size in bytes
    output_file_size INTEGER, -- Size in bytes
    processing_time_seconds INTEGER,
    credits_used INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    error_message TEXT,
    metadata JSONB, -- Store additional processing parameters and results
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_image_jobs_user_id ON image_processing_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_image_jobs_tool_id ON image_processing_jobs(tool_id);
CREATE INDEX IF NOT EXISTS idx_image_jobs_status ON image_processing_jobs(status);
CREATE INDEX IF NOT EXISTS idx_image_jobs_created_at ON image_processing_jobs(created_at);

-- Insert sample processing job data
INSERT INTO image_processing_jobs (user_id, tool_id, tool_name, credits_used, status, processing_time_seconds, completed_at) 
VALUES 
    (1, 'background-remover', 'Background Remover', 1, 'completed', 25, CURRENT_TIMESTAMP - INTERVAL '1 day'),
    (1, 'image-upscaler', 'Image Upscaler', 1, 'completed', 30, CURRENT_TIMESTAMP - INTERVAL '1 day'),
    (2, 'style-transfer', 'Style Transfer', 2, 'completed', 45, CURRENT_TIMESTAMP - INTERVAL '2 days'),
    (2, 'background-remover', 'Background Remover', 1, 'completed', 20, CURRENT_TIMESTAMP - INTERVAL '2 days'),
    (1, 'color-corrector', 'Color Corrector', 2, 'failed', NULL, NULL)
ON CONFLICT DO NOTHING;
