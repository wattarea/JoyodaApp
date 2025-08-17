-- Update Text to Image tool to Imagen4 with proper text-to-image configuration
-- This ensures the tool shows text input form instead of image upload

-- Update the main tool entry
UPDATE ai_tools 
SET 
    tool_id = 'imagen4',
    name = 'Imagen4',
    description = 'Generate stunning, high-quality images from text descriptions using Google''s advanced Imagen4 AI model',
    category = 'text-to-image',
    fal_model_id = 'fal-ai/imagen4/preview',
    api_provider = 'fal.ai',
    credits_per_use = 2,
    is_active = true,
    is_featured = true,
    performance_stats = jsonb_build_object(
        'images_processed', 0,
        'success_rate', 99.9,
        'average_time', 15
    ),
    capabilities = jsonb_build_array(
        'High-resolution image generation',
        'Advanced prompt understanding',
        'Multiple aspect ratios',
        'Batch generation support',
        'Professional quality output'
    ),
    updated_at = NOW()
WHERE tool_id = 'text-to-image' OR name = 'Text to Image';

-- Update tool parameters for Imagen4
DELETE FROM tool_parameters WHERE tool_id IN ('text-to-image', 'imagen4');

INSERT INTO tool_parameters (tool_id, parameter_name, parameter_type, is_required, default_value, description) VALUES
('imagen4', 'prompt', 'text', true, '', 'Text description of the image to generate'),
('imagen4', 'aspect_ratio', 'select', false, '1:1', 'Aspect ratio for the generated image'),
('imagen4', 'num_images', 'number', false, '1', 'Number of images to generate (1-4)'),
('imagen4', 'output_format', 'select', false, 'png', 'Output format for generated images'),
('imagen4', 'seed', 'number', false, null, 'Seed for reproducible results');

-- Verify the update
SELECT 
    tool_id,
    name,
    category,
    fal_model_id,
    credits_per_use,
    description
FROM ai_tools 
WHERE tool_id = 'imagen4';

-- Show tool parameters
SELECT 
    parameter_name,
    parameter_type,
    is_required,
    default_value,
    description
FROM tool_parameters 
WHERE tool_id = 'imagen4'
ORDER BY parameter_name;
