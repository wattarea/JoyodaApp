-- Insert example AI tools that work with fal.ai integration
INSERT INTO ai_tools (
  tool_id,
  name,
  description,
  category,
  fal_model_id,
  api_provider,
  credits_per_use,
  input_parameters,
  supported_formats,
  max_file_size_mb,
  processing_time_estimate,
  output_format,
  is_active,
  is_featured,
  icon_name,
  rating,
  success_rate
) VALUES 
-- Text to Image Generator
(
  'text-to-image-xl',
  'Text to Image Generator',
  'Generate high-quality images from text descriptions using Stable Diffusion XL Lightning',
  'text-to-image',
  'fal-ai/stable-diffusion-xl-lightning',
  'fal',
  2,
  '{"prompt": {"type": "string", "required": true, "description": "Text description of the image to generate"}, "image_size": {"type": "string", "default": "square_hd", "options": ["square_hd", "square", "portrait_4_3", "portrait_16_9", "landscape_4_3", "landscape_16_9"]}, "num_inference_steps": {"type": "integer", "default": 4, "min": 1, "max": 8}}',
  '["PNG", "JPG"]',
  NULL,
  15,
  'PNG',
  true,
  true,
  'ImageIcon',
  4.8,
  99.2
),

-- Background Remover
(
  'background-remover',
  'Background Remover',
  'Automatically remove backgrounds from images with AI precision',
  'image-editing',
  'fal-ai/birefnet',
  'fal',
  1,
  '{"image_url": {"type": "string", "required": true, "description": "URL of the image to process"}}',
  '["PNG", "JPG", "JPEG"]',
  10,
  20,
  'PNG',
  true,
  true,
  'Scissors',
  4.9,
  98.5
),

-- Image Upscaler
(
  'image-upscaler',
  'Image Upscaler',
  'Enhance and upscale images to higher resolution without quality loss',
  'enhancement',
  'fal-ai/clarity-upscaler',
  'fal',
  2,
  '{"image_url": {"type": "string", "required": true, "description": "URL of the image to upscale"}, "scale_factor": {"type": "integer", "default": 2, "options": [2, 4], "description": "Upscaling factor"}}',
  '["PNG", "JPG", "JPEG"]',
  10,
  30,
  'PNG',
  true,
  true,
  'TrendingUp',
  4.7,
  97.8
),

-- Face Enhancer
(
  'face-enhancer',
  'Face Enhancer',
  'Enhance facial features and improve portrait quality with AI',
  'enhancement',
  'fal-ai/face-to-many',
  'fal',
  2,
  '{"image_url": {"type": "string", "required": true, "description": "URL of the portrait image"}, "style": {"type": "string", "default": "enhance", "options": ["enhance", "beautify", "restore"]}}',
  '["PNG", "JPG", "JPEG"]',
  10,
  25,
  'PNG',
  true,
  false,
  'UserCheck',
  4.6,
  96.3
),

-- Style Transfer
(
  'style-transfer',
  'Style Transfer',
  'Apply artistic styles to your images using AI',
  'artistic',
  'fal-ai/stable-diffusion-xl-lightning',
  'fal',
  3,
  '{"image_url": {"type": "string", "required": true, "description": "URL of the base image"}, "style_prompt": {"type": "string", "required": true, "description": "Description of the artistic style to apply"}, "strength": {"type": "number", "default": 0.8, "min": 0.1, "max": 1.0}}',
  '["PNG", "JPG", "JPEG"]',
  10,
  35,
  'PNG',
  true,
  false,
  'Palette',
  4.5,
  95.7
),

-- Image Restoration
(
  'image-restoration',
  'Image Restoration',
  'Restore old, damaged, or low-quality photos with AI',
  'repair',
  'fal-ai/face-to-many',
  'fal',
  3,
  '{"image_url": {"type": "string", "required": true, "description": "URL of the image to restore"}, "restoration_type": {"type": "string", "default": "general", "options": ["general", "face", "old_photo"]}}',
  '["PNG", "JPG", "JPEG"]',
  10,
  40,
  'PNG',
  true,
  false,
  'RefreshCw',
  4.8,
  94.2
);

-- Update usage counts with realistic numbers
UPDATE ai_tools SET usage_count = 
  CASE tool_id
    WHEN 'text-to-image-xl' THEN 15420
    WHEN 'background-remover' THEN 12850
    WHEN 'image-upscaler' THEN 8230
    WHEN 'face-enhancer' THEN 4670
    WHEN 'style-transfer' THEN 6180
    WHEN 'image-restoration' THEN 3240
  END
WHERE tool_id IN ('text-to-image-xl', 'background-remover', 'image-upscaler', 'face-enhancer', 'style-transfer', 'image-restoration');
