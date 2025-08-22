-- Add Nextstep-1 Image Editor tool
INSERT INTO ai_tools (
  tool_id,
  name,
  description,
  category,
  credits_per_use,
  fal_model_id,
  is_featured,
  rating,
  usage_count,
  image_url
) VALUES (
  'nextstep-image-editor',
  'Nextstep Image Editor',
  'Advanced autoregressive image editing with AI. Transform your images with precise control using prompts and negative prompts.',
  'editing',
  3,
  'fal-ai/nextstep-1',
  true,
  4.8,
  0,
  '/placeholder.svg?height=400&width=400'
);
