-- Insert Text-to-Image tool using fal-ai/stable-diffusion-xl-lightning
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
  rating,
  usage_count,
  success_rate,
  processing_time_estimate,
  max_file_size_mb,
  input_parameters,
  supported_formats,
  output_format,
  icon_name,
  created_at,
  updated_at
) VALUES (
  'text-to-image',
  'Text to Image',
  'Generate stunning images from text descriptions using advanced AI. Create artwork, illustrations, and visual content with just a few words.',
  'text-to-image',
  'fal-ai/stable-diffusion-xl-lightning',
  'fal',
  1,
  true,
  true,
  4.8,
  0,
  98.5,
  15,
  0,
  '{
    "prompt": {
      "type": "text",
      "required": true,
      "description": "Describe the image you want to generate",
      "placeholder": "A beautiful sunset over mountains..."
    },
    "negative_prompt": {
      "type": "text",
      "required": false,
      "description": "What you don''t want in the image",
      "placeholder": "blurry, low quality, distorted..."
    },
    "width": {
      "type": "select",
      "required": false,
      "default": "1024",
      "options": ["512", "768", "1024", "1280"]
    },
    "height": {
      "type": "select",
      "required": false,
      "default": "1024",
      "options": ["512", "768", "1024", "1280"]
    },
    "num_inference_steps": {
      "type": "number",
      "required": false,
      "default": "4",
      "min": 1,
      "max": 8,
      "description": "Number of denoising steps (higher = better quality, slower)"
    },
    "guidance_scale": {
      "type": "number",
      "required": false,
      "default": "7.5",
      "min": 1,
      "max": 20,
      "step": 0.5,
      "description": "How closely to follow the prompt"
    }
  }',
  '["text"]',
  'png',
  'ImageIcon',
  NOW(),
  NOW()
);

-- Insert tool parameters for the text-to-image tool
INSERT INTO tool_parameters (
  tool_id,
  parameter_name,
  display_name,
  parameter_type,
  default_value,
  description,
  is_required,
  display_order,
  created_at
) VALUES 
(
  'text-to-image',
  'prompt',
  'Image Description',
  'textarea',
  '',
  'Describe the image you want to generate in detail',
  true,
  1,
  NOW()
),
(
  'text-to-image',
  'negative_prompt',
  'Negative Prompt',
  'textarea',
  'blurry, low quality, distorted, ugly',
  'Describe what you don''t want in the image',
  false,
  2,
  NOW()
),
(
  'text-to-image',
  'width',
  'Width',
  'select',
  '1024',
  'Image width in pixels',
  false,
  3,
  NOW()
),
(
  'text-to-image',
  'height',
  'Height',
  'select',
  '1024',
  'Image height in pixels',
  false,
  4,
  NOW()
),
(
  'text-to-image',
  'num_inference_steps',
  'Quality Steps',
  'number',
  '4',
  'Number of generation steps (higher = better quality)',
  false,
  5,
  NOW()
),
(
  'text-to-image',
  'guidance_scale',
  'Prompt Strength',
  'number',
  '7.5',
  'How closely to follow your description',
  false,
  6,
  NOW()
);

-- Update tool parameters with options for select fields
UPDATE tool_parameters 
SET options = '["512", "768", "1024", "1280"]'
WHERE tool_id = 'text-to-image' AND parameter_name IN ('width', 'height');

UPDATE tool_parameters 
SET min_value = 1, max_value = 8
WHERE tool_id = 'text-to-image' AND parameter_name = 'num_inference_steps';

UPDATE tool_parameters 
SET min_value = 1, max_value = 20, step_value = 0.5
WHERE tool_id = 'text-to-image' AND parameter_name = 'guidance_scale';
