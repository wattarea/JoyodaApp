-- Fix Text to Image tool to have correct category and configuration
UPDATE ai_tools 
SET 
  category = 'text-to-image',
  name = 'Text to Image',
  description = 'Generate stunning images from text descriptions using Google''s Imagen4 AI',
  fal_model_id = 'fal-ai/imagen4/preview',
  api_provider = 'fal.ai',
  credits_per_use = 2,
  processing_time_seconds = 25,
  success_rate = 99.5,
  updated_at = NOW()
WHERE tool_id = 'text-to-image' OR name LIKE '%Text to Image%' OR name LIKE '%Imagen4%';

-- Ensure the tool has the correct parameters for text-to-image generation
DELETE FROM tool_parameters WHERE tool_id IN (
  SELECT tool_id FROM ai_tools WHERE category = 'text-to-image'
);

INSERT INTO tool_parameters (tool_id, parameter_name, parameter_type, is_required, default_value, description)
SELECT 
  tool_id,
  'prompt',
  'text',
  true,
  NULL,
  'Text description of the image to generate'
FROM ai_tools WHERE category = 'text-to-image'

UNION ALL

SELECT 
  tool_id,
  'aspect_ratio',
  'select',
  false,
  '1:1',
  'Aspect ratio for the generated image'
FROM ai_tools WHERE category = 'text-to-image'

UNION ALL

SELECT 
  tool_id,
  'num_images',
  'number',
  false,
  '1',
  'Number of images to generate (1-4)'
FROM ai_tools WHERE category = 'text-to-image'

UNION ALL

SELECT 
  tool_id,
  'output_format',
  'select',
  false,
  'png',
  'Output format for generated images'
FROM ai_tools WHERE category = 'text-to-image'

UNION ALL

SELECT 
  tool_id,
  'seed',
  'number',
  false,
  NULL,
  'Seed for reproducible results (optional)'
FROM ai_tools WHERE category = 'text-to-image';

-- Verify the update
SELECT 
  tool_id,
  name,
  category,
  fal_model_id,
  credits_per_use,
  description
FROM ai_tools 
WHERE category = 'text-to-image';
