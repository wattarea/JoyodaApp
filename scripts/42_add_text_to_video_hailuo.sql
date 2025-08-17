-- Add Text to Video (Hailuo-02) tool to the database
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
  processing_time_seconds,
  success_rate,
  usage_count,
  created_at,
  updated_at
) VALUES (
  'text-to-video-hailuo',
  'Text to Video (Hailuo-02)',
  'Transform static images into dynamic videos with natural motion synthesis',
  'image-to-video',
  'fal-ai/minimax/hailuo-02/standard/image-to-video',
  'fal.ai',
  8,
  true,
  true,
  240, -- 4 minutes processing time
  98.5,
  0,
  NOW(),
  NOW()
) ON CONFLICT (tool_id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  fal_model_id = EXCLUDED.fal_model_id,
  api_provider = EXCLUDED.api_provider,
  credits_per_use = EXCLUDED.credits_per_use,
  is_active = EXCLUDED.is_active,
  is_featured = EXCLUDED.is_featured,
  processing_time_seconds = EXCLUDED.processing_time_seconds,
  success_rate = EXCLUDED.success_rate,
  updated_at = NOW();

-- Add tool parameters for Hailuo-02
INSERT INTO tool_parameters (
  tool_id,
  parameter_name,
  parameter_type,
  is_required,
  default_value,
  description,
  validation_rules
) VALUES 
  ((SELECT id FROM ai_tools WHERE tool_id = 'text-to-video-hailuo'), 'image_url', 'string', true, NULL, 'Source image URL to animate', '{"maxSize": "20MB", "formats": ["jpg", "jpeg", "png", "webp", "gif", "avif"]}'),
  ((SELECT id FROM ai_tools WHERE tool_id = 'text-to-video-hailuo'), 'prompt', 'string', true, NULL, 'Motion description prompt', '{"minLength": 10, "maxLength": 500}'),
  ((SELECT id FROM ai_tools WHERE tool_id = 'text-to-video-hailuo'), 'duration', 'integer', false, '6', 'Video duration in seconds', '{"min": 1, "max": 6}'),
  ((SELECT id FROM ai_tools WHERE tool_id = 'text-to-video-hailuo'), 'resolution', 'string', false, '768P', 'Video resolution', '{"options": ["768P"]}'),
  ((SELECT id FROM ai_tools WHERE tool_id = 'text-to-video-hailuo'), 'prompt_optimizer', 'boolean', false, 'true', 'Enable prompt optimization', '{}')
ON CONFLICT (tool_id, parameter_name) DO UPDATE SET
  parameter_type = EXCLUDED.parameter_type,
  is_required = EXCLUDED.is_required,
  default_value = EXCLUDED.default_value,
  description = EXCLUDED.description,
  validation_rules = EXCLUDED.validation_rules;

-- Verify the tool was added
SELECT 
  tool_id,
  name,
  category,
  fal_model_id,
  credits_per_use,
  is_active
FROM ai_tools 
WHERE tool_id = 'text-to-video-hailuo';
