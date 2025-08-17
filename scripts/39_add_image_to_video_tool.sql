-- Add Image to Video tool to the database
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
  average_processing_time,
  success_rate,
  usage_count,
  input_parameters,
  created_at,
  updated_at
) VALUES (
  'image-to-video',
  'Image to Video',
  'Transform static images into dynamic videos with AI motion',
  'image-to-video',
  'fal-ai/kling-video/v1.6/pro/image-to-video',
  'fal.ai',
  10, -- Higher cost due to video generation complexity ($0.475-$0.95 per video)
  true,
  true,
  360, -- ~6 minutes processing time
  95.0,
  0,
  '[
    {
      "name": "image_url",
      "type": "string",
      "required": true,
      "description": "URL of the source image to animate"
    },
    {
      "name": "prompt",
      "type": "string", 
      "required": true,
      "description": "Text description of the desired motion and scene"
    },
    {
      "name": "duration",
      "type": "string",
      "required": false,
      "description": "Video duration in seconds (5 or 10)",
      "default": "5"
    },
    {
      "name": "aspect_ratio",
      "type": "string",
      "required": false,
      "description": "Output aspect ratio (16:9, 9:16, 1:1, etc.)",
      "default": "16:9"
    },
    {
      "name": "negative_prompt",
      "type": "string",
      "required": false,
      "description": "Elements to avoid in the generation"
    },
    {
      "name": "cfg_scale",
      "type": "number",
      "required": false,
      "description": "Classifier Free Guidance scale (0.1-1.0)",
      "default": 0.5
    }
  ]'::jsonb,
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
  average_processing_time = EXCLUDED.average_processing_time,
  success_rate = EXCLUDED.success_rate,
  input_parameters = EXCLUDED.input_parameters,
  updated_at = NOW();

-- Verify the tool was added
SELECT tool_id, name, category, fal_model_id, credits_per_use, is_active 
FROM ai_tools 
WHERE tool_id = 'image-to-video';
