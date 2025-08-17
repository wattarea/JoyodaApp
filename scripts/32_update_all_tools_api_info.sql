-- Update all AI tools with correct API information, optimized names, and standardized credit costs

-- First, clear existing tools to avoid duplicates
DELETE FROM ai_tools;
DELETE FROM tool_parameters;

-- Insert Background Remover (fal-ai/birefnet)
INSERT INTO ai_tools (
    tool_id, name, description, category, fal_model_id, api_provider,
    credits_per_use, processing_time_estimate, success_rate, rating,
    is_active, is_featured, icon_name, supported_formats, max_file_size_mb,
    output_format, usage_count, created_at, updated_at
) VALUES (
    'background-remover',
    'Background Remover',
    'Automatically remove backgrounds from images with AI precision using BiRefNet technology',
    'editing',
    'fal-ai/birefnet',
    'fal.ai',
    1, 4, 99.9, 4.8,
    true, true, 'scissors',
    '["jpg", "jpeg", "png", "webp", "gif", "avif"]',
    10,
    'png',
    0, NOW(), NOW()
);

-- Insert Face Enhancer (fal-ai/image-editing/face-enhancement)
INSERT INTO ai_tools (
    tool_id, name, description, category, fal_model_id, api_provider,
    credits_per_use, processing_time_estimate, success_rate, rating,
    is_active, is_featured, icon_name, supported_formats, max_file_size_mb,
    output_format, usage_count, created_at, updated_at
) VALUES (
    'face-enhancer',
    'Face Enhancer',
    'Enhance and restore facial features in photos with professional-grade AI retouching',
    'enhancement',
    'fal-ai/image-editing/face-enhancement',
    'fal.ai',
    2, 6, 99.5, 4.7,
    true, true, 'user',
    '["jpg", "jpeg", "png", "webp", "gif", "avif"]',
    10,
    'png',
    0, NOW(), NOW()
);

-- Insert Style Transfer (fal-ai/image-editing/plushie-style)
INSERT INTO ai_tools (
    tool_id, name, description, category, fal_model_id, api_provider,
    credits_per_use, processing_time_estimate, success_rate, rating,
    is_active, is_featured, icon_name, supported_formats, max_file_size_mb,
    output_format, usage_count, created_at, updated_at
) VALUES (
    'style-transfer',
    'Plushie Style Transfer',
    'Transform photos into adorable plushie-style images while preserving character likeness',
    'artistic',
    'fal-ai/image-editing/plushie-style',
    'fal.ai',
    2, 8, 98.5, 4.6,
    true, true, 'palette',
    '["jpg", "jpeg", "png", "webp", "gif", "avif"]',
    10,
    'png',
    0, NOW(), NOW()
);

-- Insert Text to Image (fal-ai/imagen4/preview)
INSERT INTO ai_tools (
    tool_id, name, description, category, fal_model_id, api_provider,
    credits_per_use, processing_time_estimate, success_rate, rating,
    is_active, is_featured, icon_name, supported_formats, max_file_size_mb,
    output_format, usage_count, created_at, updated_at
) VALUES (
    'text-to-image',
    'Text to Image',
    'Generate stunning images from text descriptions using Google Imagen4 with exceptional quality',
    'generation',
    'fal-ai/imagen4/preview',
    'fal.ai',
    2, 12, 99.2, 4.9,
    true, true, 'image',
    '["text"]',
    0,
    'png',
    0, NOW(), NOW()
);

-- Insert Virtual Try-On (fal-ai/fashn/tryon/v1.5)
INSERT INTO ai_tools (
    tool_id, name, description, category, fal_model_id, api_provider,
    credits_per_use, processing_time_estimate, success_rate, rating,
    is_active, is_featured, icon_name, supported_formats, max_file_size_mb,
    output_format, usage_count, created_at, updated_at
) VALUES (
    'virtual-tryon',
    'Virtual Try-On',
    'Try on clothing virtually using AI. Upload a person image and garment image to see realistic fashion results',
    'fashion',
    'fal-ai/fashn/tryon/v1.5',
    'fal.ai',
    3, 30, 95.8, 4.5,
    true, true, 'shirt',
    '["jpg", "jpeg", "png", "webp", "gif", "avif"]',
    10,
    'png',
    0, NOW(), NOW()
);

-- Insert Face Swap (fal-ai/ideogram/character)
INSERT INTO ai_tools (
    tool_id, name, description, category, fal_model_id, api_provider,
    credits_per_use, processing_time_estimate, success_rate, rating,
    is_active, is_featured, icon_name, supported_formats, max_file_size_mb,
    output_format, usage_count, created_at, updated_at
) VALUES (
    'face-swap',
    'Face Swap',
    'Generate consistent character appearances across multiple images using reference photos',
    'creative',
    'fal-ai/ideogram/character',
    'fal.ai',
    2, 15, 97.2, 4.4,
    true, true, 'users',
    '["jpg", "jpeg", "png", "webp", "gif", "avif"]',
    10,
    'png',
    0, NOW(), NOW()
);

-- Insert Age Progression (fal-ai/image-editing/age-progression)
INSERT INTO ai_tools (
    tool_id, name, description, category, fal_model_id, api_provider,
    credits_per_use, processing_time_estimate, success_rate, rating,
    is_active, is_featured, icon_name, supported_formats, max_file_size_mb,
    output_format, usage_count, created_at, updated_at
) VALUES (
    'age-progression',
    'Age Progression',
    'Transform faces to show aging or youth progression using advanced AI facial modeling',
    'image editing',
    'fal-ai/image-editing/age-progression',
    'fal.ai',
    2, 10, 96.8, 4.6,
    true, true, 'clock',
    '["jpg", "jpeg", "png", "webp", "gif", "avif"]',
    10,
    'png',
    0, NOW(), NOW()
);

-- Insert Image Upscaler (fal-ai/esrgan)
INSERT INTO ai_tools (
    tool_id, name, description, category, fal_model_id, api_provider,
    credits_per_use, processing_time_estimate, success_rate, rating,
    is_active, is_featured, icon_name, supported_formats, max_file_size_mb,
    output_format, usage_count, created_at, updated_at
) VALUES (
    'image-upscaler',
    'Image Upscaler',
    'Enhance image resolution up to 4x without losing quality using ESRGAN technology',
    'enhancement',
    'fal-ai/esrgan',
    'fal.ai',
    1, 8, 98.9, 4.7,
    true, true, 'maximize',
    '["jpg", "jpeg", "png", "webp", "gif", "avif"]',
    10,
    'png',
    0, NOW(), NOW()
);

-- Add tool parameters for Text to Image (Imagen4)
INSERT INTO tool_parameters (
    tool_id, parameter_name, display_name, parameter_type, is_required,
    default_value, description, display_order, created_at
) VALUES 
    ('text-to-image', 'prompt', 'Prompt', 'text', true, '', 'Describe what you want to generate', 1, NOW()),
    ('text-to-image', 'aspect_ratio', 'Aspect Ratio', 'select', false, 'square', 'Choose image dimensions', 2, NOW()),
    ('text-to-image', 'num_images', 'Number of Images', 'number', false, '1', 'Generate 1-4 images', 3, NOW()),
    ('text-to-image', 'output_format', 'Output Format', 'select', false, 'png', 'Choose file format', 4, NOW());

-- Add tool parameters for Virtual Try-On
INSERT INTO tool_parameters (
    tool_id, parameter_name, display_name, parameter_type, is_required,
    default_value, description, display_order, created_at
) VALUES 
    ('virtual-tryon', 'person_image_url', 'Person Image', 'file', true, '', 'Upload person photo', 1, NOW()),
    ('virtual-tryon', 'garment_image_url', 'Garment Image', 'file', true, '', 'Upload garment photo', 2, NOW()),
    ('virtual-tryon', 'garment_type', 'Garment Type', 'select', true, 'tops', 'Select garment category', 3, NOW());

-- Add tool parameters for Face Swap
INSERT INTO tool_parameters (
    tool_id, parameter_name, display_name, parameter_type, is_required,
    default_value, description, display_order, created_at
) VALUES 
    ('face-swap', 'prompt', 'Character Description', 'text', true, '', 'Describe the character to generate', 1, NOW()),
    ('face-swap', 'reference_image_urls', 'Reference Images', 'file', true, '', 'Upload 1-5 reference images', 2, NOW()),
    ('face-swap', 'quality', 'Quality Level', 'select', false, 'BALANCED', 'Choose generation quality', 3, NOW());

-- Add tool parameters for Style Transfer (Plushie)
INSERT INTO tool_parameters (
    tool_id, parameter_name, display_name, parameter_type, is_required,
    default_value, description, display_order, created_at
) VALUES 
    ('style-transfer', 'image_url', 'Input Image', 'file', true, '', 'Upload image to stylize', 1, NOW()),
    ('style-transfer', 'plushie_intensity', 'Plushie Effect', 'range', false, '0.8', 'Control plushie transformation strength', 2, NOW()),
    ('style-transfer', 'color_mode', 'Color Enhancement', 'select', false, 'natural', 'Choose color style', 3, NOW());

-- Add tool parameters for Age Progression
INSERT INTO tool_parameters (
    tool_id, parameter_name, display_name, parameter_type, is_required,
    default_value, description, display_order, created_at
) VALUES 
    ('age-progression', 'image_url', 'Input Image', 'file', true, '', 'Upload face photo', 1, NOW()),
    ('age-progression', 'age_change', 'Age Change', 'number', true, '10', 'Years to add/subtract (-50 to +50)', 2, NOW());

-- Update input_parameters JSON for each tool
UPDATE ai_tools SET input_parameters = '{"image_url": {"type": "file", "required": true}}' 
WHERE tool_id IN ('background-remover', 'face-enhancer', 'image-upscaler');

UPDATE ai_tools SET input_parameters = '{"prompt": {"type": "text", "required": true}, "aspect_ratio": {"type": "select", "required": false}, "num_images": {"type": "number", "required": false}}' 
WHERE tool_id = 'text-to-image';

UPDATE ai_tools SET input_parameters = '{"person_image_url": {"type": "file", "required": true}, "garment_image_url": {"type": "file", "required": true}, "garment_type": {"type": "select", "required": true}}' 
WHERE tool_id = 'virtual-tryon';

UPDATE ai_tools SET input_parameters = '{"prompt": {"type": "text", "required": true}, "reference_image_urls": {"type": "file", "required": true}, "quality": {"type": "select", "required": false}}' 
WHERE tool_id = 'face-swap';

UPDATE ai_tools SET input_parameters = '{"image_url": {"type": "file", "required": true}, "plushie_intensity": {"type": "range", "required": false}, "color_mode": {"type": "select", "required": false}}' 
WHERE tool_id = 'style-transfer';

UPDATE ai_tools SET input_parameters = '{"image_url": {"type": "file", "required": true}, "age_change": {"type": "number", "required": true}}' 
WHERE tool_id = 'age-progression';
