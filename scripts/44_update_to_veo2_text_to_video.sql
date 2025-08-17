-- Update Text to Video (Kling 1.6) to use Veo 2 text-to-video API
UPDATE ai_tools 
SET 
  name = 'Text to Video (Veo 2)',
  description = 'Generate high-quality videos from text descriptions using Google Veo 2',
  fal_model_id = 'fal-ai/veo2',
  category = 'text-to-video',
  credits_per_use = 12,
  processing_time_seconds = 180,
  success_rate = 98.5,
  input_parameters = jsonb_build_object(
    'prompt', jsonb_build_object(
      'type', 'string',
      'required', true,
      'description', 'Text description of the video you want to generate'
    ),
    'duration', jsonb_build_object(
      'type', 'select',
      'required', false,
      'default', '5s',
      'options', jsonb_build_array('5s', '6s', '7s', '8s'),
      'description', 'Duration of the generated video'
    ),
    'aspect_ratio', jsonb_build_object(
      'type', 'select',
      'required', false,
      'default', '16:9',
      'options', jsonb_build_array('16:9', '9:16'),
      'description', 'Aspect ratio of the generated video'
    ),
    'negative_prompt', jsonb_build_object(
      'type', 'string',
      'required', false,
      'description', 'What to avoid in the video generation'
    ),
    'enhance_prompt', jsonb_build_object(
      'type', 'boolean',
      'required', false,
      'default', true,
      'description', 'Whether to enhance the prompt for better results'
    ),
    'seed', jsonb_build_object(
      'type', 'number',
      'required', false,
      'description', 'Seed for reproducible results'
    )
  )
WHERE tool_id = 'text-to-video-kling';

-- Verify the update
SELECT tool_id, name, fal_model_id, category, credits_per_use 
FROM ai_tools 
WHERE tool_id = 'text-to-video-kling';
