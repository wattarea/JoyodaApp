-- Add Character Generation tool to the database
INSERT INTO ai_tools (
  tool_id,
  name,
  description,
  category,
  fal_model_id,
  credits_per_use,
  is_active,
  is_featured,
  icon_name,
  created_at,
  updated_at
) VALUES (
  'character-generation',
  'Character Generation',
  'Generate consistent character appearances across multiple images. Maintain facial features and distinctive traits for cohesive storytelling and branding.',
  'creative',
  'fal-ai/ideogram/character',
  2,
  true,
  true,
  'Users',
  NOW(),
  NOW()
) ON CONFLICT (tool_id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  fal_model_id = EXCLUDED.fal_model_id,
  credits_per_use = EXCLUDED.credits_per_use,
  is_active = EXCLUDED.is_active,
  is_featured = EXCLUDED.is_featured,
  icon_name = EXCLUDED.icon_name,
  updated_at = NOW();

-- Add tool parameters for Character Generation
INSERT INTO tool_parameters (
  tool_id,
  parameter_name,
  parameter_type,
  is_required,
  default_value,
  description,
  created_at
) VALUES 
(
  (SELECT id FROM ai_tools WHERE tool_id = 'character-generation'),
  'prompt',
  'text',
  true,
  NULL,
  'Character description and scene details',
  NOW()
),
(
  (SELECT id FROM ai_tools WHERE tool_id = 'character-generation'),
  'reference_image_urls',
  'array',
  true,
  NULL,
  'Reference images for character consistency (1-5 images)',
  NOW()
),
(
  (SELECT id FROM ai_tools WHERE tool_id = 'character-generation'),
  'quality',
  'select',
  false,
  'TURBO',
  'Quality level: TURBO, BALANCED, or QUALITY',
  NOW()
) ON CONFLICT (tool_id, parameter_name) DO UPDATE SET
  parameter_type = EXCLUDED.parameter_type,
  is_required = EXCLUDED.is_required,
  default_value = EXCLUDED.default_value,
  description = EXCLUDED.description;
