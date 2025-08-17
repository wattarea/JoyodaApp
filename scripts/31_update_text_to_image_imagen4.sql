-- Update Text to Image tool to use Imagen4 model and update information
UPDATE ai_tools 
SET 
  fal_model_id = 'fal-ai/imagen4/preview',
  description = 'Generate stunning, photorealistic images from text descriptions using Google''s most advanced Imagen4 AI model. Features exceptional quality, multiple aspect ratios, and professional-grade results.',
  credits_per_use = 2,
  updated_at = NOW()
WHERE tool_id = 'text-to-image';

-- Update tool parameters for Imagen4
DELETE FROM ai_tool_parameters WHERE tool_id = (SELECT id FROM ai_tools WHERE tool_id = 'text-to-image');

INSERT INTO ai_tool_parameters (tool_id, parameter_name, parameter_type, is_required, default_value, description)
SELECT 
  id,
  'prompt',
  'text',
  true,
  NULL,
  'Text description of the image to generate'
FROM ai_tools WHERE tool_id = 'text-to-image'

UNION ALL

SELECT 
  id,
  'aspect_ratio',
  'select',
  false,
  '1:1',
  'Aspect ratio of the generated image'
FROM ai_tools WHERE tool_id = 'text-to-image'

UNION ALL

SELECT 
  id,
  'num_images',
  'number',
  false,
  '1',
  'Number of images to generate (1-4)'
FROM ai_tools WHERE tool_id = 'text-to-image'

UNION ALL

SELECT 
  id,
  'seed',
  'number',
  false,
  NULL,
  'Seed for reproducible results'
FROM ai_tools WHERE tool_id = 'text-to-image'

UNION ALL

SELECT 
  id,
  'output_format',
  'select',
  false,
  'png',
  'Output image format'
FROM ai_tools WHERE tool_id = 'text-to-image';
