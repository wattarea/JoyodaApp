-- Add Character Generation (Face Swap) tool to the database
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
  input_parameters,
  created_at,
  updated_at
) VALUES (
  'character-generation',
  'Tutarlı karakterler (Face Swap)',
  'Generate consistent character appearances across multiple images. Maintain facial features, proportions, and distinctive traits for cohesive storytelling and branding using AI.',
  'creative',
  'fal-ai/ideogram/character',
  2,
  true,
  true,
  'Users',
  jsonb_build_object(
    'prompt', jsonb_build_object(
      'type', 'string',
      'required', true,
      'description', 'Character description and scene details'
    ),
    'reference_image_urls', jsonb_build_object(
      'type', 'array',
      'required', true,
      'description', 'Reference images for character consistency (1-5 images)'
    ),
    'quality', jsonb_build_object(
      'type', 'string',
      'required', false,
      'default', 'TURBO',
      'enum', jsonb_build_array('TURBO', 'BALANCED', 'QUALITY'),
      'description', 'Quality level: TURBO (fastest), BALANCED (good quality), QUALITY (best results)'
    )
  ),
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
  input_parameters = EXCLUDED.input_parameters,
  updated_at = NOW();
