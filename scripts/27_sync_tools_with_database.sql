-- Check current tools in database and add missing ones
SELECT 'Current tools in database:' as info;
SELECT tool_id, name, category, credits_per_use, is_active FROM ai_tools ORDER BY name;

-- Insert missing tools that are shown on the Tools page
INSERT INTO ai_tools (
    tool_id, name, description, category, fal_model_id, api_provider, 
    credits_per_use, is_active, is_featured, icon_name, 
    processing_time_estimate, success_rate, rating, usage_count,
    input_parameters, supported_formats, max_file_size_mb, output_format,
    created_at, updated_at
) VALUES 
-- Age Progression/Regression
('age-progression', 'Age Progression/Regression', 'Transform faces to show aging or youth progression using advanced AI. Upload a portrait photo and adjust the age to see realistic aging or youth effects.', 'image editing', 'fal-ai/image-editing/age-progression', 'fal.ai', 2, true, true, 'User', 30, 99.9, 4.6, 1, 
'[{"name": "age_change", "type": "text", "required": true, "description": "Age change description (e.g., ''20 years older'', ''15 years younger'')"}]'::jsonb,
'["jpg", "jpeg", "png", "webp"]'::jsonb, 10, 'png', NOW(), NOW()),

-- Background Remover  
('background-remover', 'Background Remover', 'Automatically remove backgrounds from images with AI precision', 'editing', 'fal-ai/birefnet', 'fal.ai', 1, true, true, 'Scissors', 15, 99.9, 0, 4,
'[]'::jsonb, '["jpg", "jpeg", "png", "webp"]'::jsonb, 10, 'png', NOW(), NOW()),

-- Face Enhancer
('face-enhancer', 'Face Enhancer', 'Enhance and restore facial features in photos', 'enhancement', 'fal-ai/face-to-many', 'fal.ai', 2, true, true, 'Sparkles', 25, 99.9, 0, 0,
'[]'::jsonb, '["jpg", "jpeg", "png", "webp"]'::jsonb, 10, 'png', NOW(), NOW()),

-- Image Upscaler
('image-upscaler', 'Image Upscaler', 'Enhance image resolution up to 4x without losing quality', 'enhancement', 'fal-ai/clarity-upscaler', 'fal.ai', 1, true, true, 'ZoomIn', 20, 99.9, 0, 1,
'[]'::jsonb, '["jpg", "jpeg", "png", "webp"]'::jsonb, 10, 'png', NOW(), NOW()),

-- Style Transfer
('style-transfer', 'Style Transfer', 'Apply artistic styles to your images using AI', 'artistic', 'fal-ai/stable-diffusion-xl-lightning', 'fal.ai', 2, true, true, 'Palette', 30, 99.9, 0, 0,
'[{"name": "style_prompt", "type": "text", "required": true, "description": "Style description"}]'::jsonb,
'["jpg", "jpeg", "png", "webp"]'::jsonb, 10, 'png', NOW(), NOW()),

-- Text to Image
('text-to-image', 'Text to Image', 'Generate stunning images from text descriptions using AI', 'generation', 'fal-ai/stable-diffusion-xl-lightning', 'fal.ai', 2, true, true, 'ImageIcon', 25, 99.9, 0, 0,
'[{"name": "prompt", "type": "text", "required": true, "description": "Image description"}]'::jsonb,
'["jpg", "jpeg", "png", "webp"]'::jsonb, 10, 'png', NOW(), NOW()),

-- Virtual Try-On
('virtual-tryon', 'Virtual Try-On', 'Try on clothing virtually using AI. Upload a person image and garment image to see realistic fashion AI technology.', 'fashion', 'fal-ai/fashn/tryon/v1.5', 'fal.ai', 3, true, true, 'Shirt', 30, 99.9, 0, 1,
'[{"name": "person_image_url", "type": "image", "required": true, "description": "Person image URL"}, {"name": "garment_image_url", "type": "image", "required": true, "description": "Garment image URL"}, {"name": "garment_type", "type": "select", "required": false, "description": "Type of garment", "options": ["tops", "bottoms", "one-pieces"]}]'::jsonb,
'["jpg", "jpeg", "png", "webp"]'::jsonb, 10, 'png', NOW(), NOW())

ON CONFLICT (tool_id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    category = EXCLUDED.category,
    fal_model_id = EXCLUDED.fal_model_id,
    credits_per_use = EXCLUDED.credits_per_use,
    is_active = EXCLUDED.is_active,
    is_featured = EXCLUDED.is_featured,
    icon_name = EXCLUDED.icon_name,
    processing_time_estimate = EXCLUDED.processing_time_estimate,
    success_rate = EXCLUDED.success_rate,
    input_parameters = EXCLUDED.input_parameters,
    supported_formats = EXCLUDED.supported_formats,
    max_file_size_mb = EXCLUDED.max_file_size_mb,
    output_format = EXCLUDED.output_format,
    updated_at = NOW();

SELECT 'Tools after sync:' as info;
SELECT tool_id, name, category, credits_per_use, is_active FROM ai_tools ORDER BY name;
