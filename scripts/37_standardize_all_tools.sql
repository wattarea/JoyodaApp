-- Standardize all 8 tools with consistent names, descriptions, and credits
-- This ensures consistency across Landing Page, Dashboard, and Tools pages

-- Clear existing tools and insert standardized versions
DELETE FROM ai_tools;

-- Insert all 8 tools with standardized information
INSERT INTO ai_tools (
    tool_id, name, description, category, fal_model_id, api_provider,
    credits_per_use, processing_time_estimate, success_rate, rating,
    is_active, is_featured, icon_name, output_format,
    supported_formats, max_file_size_mb, usage_count,
    input_parameters, created_at, updated_at
) VALUES 
-- 1. Age Progression/Regression
(
    'age-progression', 'Age Progression/Regression', 
    'Transform faces to show aging or youth progression using advanced AI technology.',
    'image-editing', 'fal-ai/image-editing/age-progression', 'fal.ai',
    2, 25, 98.5, 4.6,
    true, true, 'clock', 'PNG',
    '["jpg", "jpeg", "png", "webp"]', 10, 0,
    '[{"name": "image_url", "type": "string", "required": true}, {"name": "age_change", "type": "number", "required": true}]',
    NOW(), NOW()
),

-- 2. Background Remover
(
    'background-remover', 'Background Remover',
    'Automatically remove backgrounds from images with AI precision and professional quality.',
    'editing', 'fal-ai/birefnet', 'fal.ai',
    1, 15, 99.2, 4.8,
    true, true, 'scissors', 'PNG',
    '["jpg", "jpeg", "png", "webp"]', 10, 0,
    '[{"name": "image_url", "type": "string", "required": true}]',
    NOW(), NOW()
),

-- 3. Face Enhancer
(
    'face-enhancer', 'Face Enhancer',
    'Enhance and restore facial features in photos with professional AI retouching.',
    'enhancement', 'fal-ai/image-editing/face-enhancement', 'fal.ai',
    2, 20, 97.8, 4.5,
    true, true, 'sparkles', 'PNG',
    '["jpg", "jpeg", "png", "webp"]', 10, 0,
    '[{"name": "image_url", "type": "string", "required": true}]',
    NOW(), NOW()
),

-- 4. Image Upscaler
(
    'image-upscaler', 'Image Upscaler',
    'Enhance image resolution up to 4x without losing quality using AI.',
    'enhancement', 'fal-ai/esrgan', 'fal.ai',
    1, 30, 96.5, 4.4,
    true, true, 'zoom-in', 'PNG',
    '["jpg", "jpeg", "png", "webp"]', 10, 0,
    '[{"name": "image_url", "type": "string", "required": true}, {"name": "scale_factor", "type": "number", "required": false}]',
    NOW(), NOW()
),

-- 5. Style Transfer
(
    'style-transfer', 'Style Transfer',
    'Apply artistic styles to your images using AI powered plushie transformation.',
    'artistic', 'fal-ai/image-editing/plushie-style', 'fal.ai',
    2, 35, 95.8, 4.3,
    true, true, 'palette', 'PNG',
    '["jpg", "jpeg", "png", "webp"]', 10, 0,
    '[{"name": "image_url", "type": "string", "required": true}, {"name": "intensity", "type": "number", "required": false}]',
    NOW(), NOW()
),

-- 6. Text to Image
(
    'text-to-image', 'Text to Image',
    'Generate stunning images from text descriptions using Google Imagen4 AI technology.',
    'text-to-image', 'fal-ai/imagen4/preview', 'fal.ai',
    2, 25, 98.9, 4.7,
    true, true, 'image', 'PNG',
    '["png", "jpg", "webp"]', 0, 0,
    '[{"name": "prompt", "type": "string", "required": true}, {"name": "aspect_ratio", "type": "string", "required": false}, {"name": "num_images", "type": "number", "required": false}]',
    NOW(), NOW()
),

-- 7. Face Swap
(
    'face-swap', 'Face Swap',
    'Generate consistent character appearances across multiple images with AI precision.',
    'creative', 'fal-ai/ideogram/character', 'fal.ai',
    2, 30, 96.2, 4.4,
    true, true, 'users', 'PNG',
    '["jpg", "jpeg", "png", "webp"]', 10, 0,
    '[{"name": "prompt", "type": "string", "required": true}, {"name": "reference_image_urls", "type": "array", "required": true}]',
    NOW(), NOW()
),

-- 8. Virtual Try-On
(
    'virtual-tryon', 'Virtual Try-On',
    'Try on clothing virtually using AI. Upload person and garment images.',
    'fashion', 'fal-ai/fashn/tryon/v1.5', 'fal.ai',
    3, 40, 94.5, 4.2,
    true, true, 'shirt', 'PNG',
    '["jpg", "jpeg", "png", "webp"]', 10, 0,
    '[{"name": "model_image", "type": "string", "required": true}, {"name": "garment_image", "type": "string", "required": true}, {"name": "category", "type": "string", "required": true}]',
    NOW(), NOW()
);

-- Verify all tools were inserted correctly
SELECT tool_id, name, description, credits_per_use, category, fal_model_id 
FROM ai_tools 
ORDER BY name;
