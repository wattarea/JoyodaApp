INSERT INTO ai_tools (
    tool_id,
    name,
    description,
    category,
    fal_model_id,
    api_provider,
    credits_per_use,
    is_active,
    is_featured,
    performance_stats,
    created_at,
    updated_at
) VALUES (
    'imagen4',
    'Imagen4',
    'Generate stunning, high-quality images from text descriptions using Google''s advanced Imagen4 model with exceptional detail and photorealism',
    'generation',
    'fal-ai/imagen4/preview',
    'fal.ai',
    2,
    true,
    true,
    jsonb_build_object(
        'images_processed', '10000+',
        'success_rate', '99.8%',
        'average_time', '8s'
    ),
    NOW(),
    NOW()
) ON CONFLICT (tool_id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    fal_model_id = EXCLUDED.fal_model_id,
    updated_at = NOW();

-- Update tool parameters for Imagen4
DELETE FROM tool_parameters WHERE tool_id = 'imagen4';

INSERT INTO tool_parameters (tool_id, parameter_name, parameter_type, is_required, default_value, description) VALUES
('imagen4', 'prompt', 'text', true, NULL, 'Text description of the image to generate'),
('imagen4', 'aspect_ratio', 'select', false, '1:1', 'Image aspect ratio (1:1, 16:9, 9:16, 4:3, 3:4)'),
('imagen4', 'num_images', 'number', false, '1', 'Number of images to generate (1-4)'),
('imagen4', 'seed', 'number', false, NULL, 'Random seed for reproducible results'),
('imagen4', 'output_format', 'select', false, 'png', 'Output image format (png, jpeg, webp)');

-- Remove old text-to-image tool if it exists
DELETE FROM tool_parameters WHERE tool_id = 'text-to-image';
DELETE FROM ai_tools WHERE tool_id = 'text-to-image';

-- Update any existing tool executions to reference the new tool_id
UPDATE tool_executions SET tool_id = 'imagen4' WHERE tool_id = 'text-to-image';
UPDATE credit_transactions SET metadata = jsonb_set(metadata, '{tool_id}', '"imagen4"') 
WHERE metadata->>'tool_id' = 'text-to-image';
