INSERT INTO ai_tools (
  tool_id,
  name,
  description,
  category,
  model_name,
  credits_per_use,
  icon_name,
  is_active,
  is_featured,
  created_at,
  updated_at
) VALUES (
  'character-generation',
  'Character Generation',
  'Generate consistent character appearances across multiple images. Maintain facial features, proportions, and distinctive traits for cohesive storytelling and branding using AI.',
  'creative',
  'fal-ai/ideogram/character',
  2,
  'Users',
  true,
  true,
  NOW(),
  NOW()
);

-- Add tool parameters
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
  'character-generation',
  'prompt',
  'text',
  true,
  NULL,
  'Text description of the character and scene to generate',
  NOW()
),
(
  'character-generation',
  'reference_image_urls',
  'array',
  true,
  NULL,
  'Reference images to maintain character consistency',
  NOW()
),
(
  'character-generation',
  'quality',
  'select',
  false,
  'BALANCED',
  'Generation quality level (TURBO, BALANCED, QUALITY)',
  NOW()
);
