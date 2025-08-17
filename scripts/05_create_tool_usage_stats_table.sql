-- Create tool_usage_stats table for analytics and performance tracking
CREATE TABLE IF NOT EXISTS tool_usage_stats (
    id SERIAL PRIMARY KEY,
    tool_id VARCHAR(100) NOT NULL,
    tool_name VARCHAR(255) NOT NULL,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    processing_time_seconds INTEGER,
    input_file_size INTEGER,
    output_file_size INTEGER,
    success BOOLEAN NOT NULL,
    error_type VARCHAR(100),
    user_rating INTEGER CHECK (user_rating >= 1 AND user_rating <= 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for analytics queries
CREATE INDEX IF NOT EXISTS idx_tool_stats_tool_id ON tool_usage_stats(tool_id);
CREATE INDEX IF NOT EXISTS idx_tool_stats_success ON tool_usage_stats(success);
CREATE INDEX IF NOT EXISTS idx_tool_stats_created_at ON tool_usage_stats(created_at);
CREATE INDEX IF NOT EXISTS idx_tool_stats_user_id ON tool_usage_stats(user_id);

-- Insert sample usage statistics
INSERT INTO tool_usage_stats (tool_id, tool_name, user_id, processing_time_seconds, success, user_rating) 
VALUES 
    ('background-remover', 'Background Remover', 1, 25, TRUE, 5),
    ('background-remover', 'Background Remover', 2, 20, TRUE, 4),
    ('image-upscaler', 'Image Upscaler', 1, 30, TRUE, 5),
    ('style-transfer', 'Style Transfer', 2, 45, TRUE, 4),
    ('color-corrector', 'Color Corrector', 1, NULL, FALSE, NULL),
    ('object-remover', 'Object Remover', 2, 35, TRUE, 5),
    ('face-enhancer', 'Face Enhancer', 1, 40, TRUE, 4)
ON CONFLICT DO NOTHING;
