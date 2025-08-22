-- Add Fashion Photoshoot tool to ai_tools table
INSERT INTO ai_tools (
  tool_id,
  name,
  description,
  category,
  fal_model_id,
  credits_per_use,
  is_active,
  rating,
  usage_count
) VALUES (
  'fashion-photoshoot',
  'Fashion Photoshoot',
  'Transform your photos into professional fashion photoshoots with AI-powered styling and backgrounds',
  'fashion',
  'easel-ai/fashion-photoshoot',
  4,
  true,
  4.6,
  0
);
