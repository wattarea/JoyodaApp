UPDATE ai_tools 
SET 
  fal_model_id = 'fal-ai/image-editing/plushie-style',
  name = 'Style Transfer',
  description = 'Transform photos into plushie-style images while keeping character likeness',
  category = 'artistic',
  credits_per_use = 1,
  processing_time_estimate = 15,
  success_rate = 99.5,
  input_parameters = jsonb_build_object(
    'image_url', jsonb_build_object('type', 'string', 'required', true, 'description', 'Source image URL'),
    'plushie_intensity', jsonb_build_object('type', 'number', 'required', false, 'default', 0.8, 'min', 0.1, 'max', 1.0, 'description', 'Intensity of plushie transformation'),
    'color_mode', jsonb_build_object('type', 'string', 'required', false, 'default', 'natural', 'enum', jsonb_build_array('natural', 'vibrant', 'pastel', 'monochrome'), 'description', 'Color enhancement mode'),
    'detail_preservation', jsonb_build_object('type', 'number', 'required', false, 'default', 0.7, 'min', 0.1, 'max', 1.0, 'description', 'Level of detail preservation'),
    'background_handling', jsonb_build_object('type', 'string', 'required', false, 'default', 'preserve', 'enum', jsonb_build_array('preserve', 'stylize', 'blur', 'remove'), 'description', 'How to handle the background')
  ),
  updated_at = CURRENT_TIMESTAMP
WHERE tool_id = 'style-transfer';

-- Verify the update
SELECT tool_id, name, fal_model_id, category, credits_per_use, description 
FROM ai_tools 
WHERE tool_id = 'style-transfer';
