-- Update the Text to Video (Kling 1.6) tool to use text-to-video category
UPDATE ai_tools 
SET 
  category = 'text-to-video',
  description = 'Generate high-quality videos from text descriptions using advanced AI',
  input_parameters = jsonb_build_object(
    'prompt', jsonb_build_object('type', 'string', 'required', true, 'description', 'Text description of the video to generate'),
    'duration', jsonb_build_object('type', 'string', 'enum', jsonb_build_array('5', '10'), 'default', '5', 'description', 'Video duration in seconds'),
    'aspect_ratio', jsonb_build_object('type', 'string', 'enum', jsonb_build_array('16:9', '9:16', '1:1', '4:3'), 'default', '16:9', 'description', 'Video aspect ratio'),
    'negative_prompt', jsonb_build_object('type', 'string', 'required', false, 'description', 'What to avoid in the video'),
    'cfg_scale', jsonb_build_object('type', 'number', 'minimum', 0.1, 'maximum', 1.0, 'default', 0.5, 'description', 'Prompt adherence strength')
  )
WHERE tool_id = 'text-to-video-kling';

-- Verify the update
SELECT tool_id, name, category, credits_per_use, input_parameters 
FROM ai_tools 
WHERE tool_id = 'text-to-video-kling';
