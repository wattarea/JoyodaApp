-- Insert example AI tools
INSERT INTO ai_tools (
    tool_id, name, description, category, fal_model_id, 
    credits_per_use, processing_time_estimate, input_parameters, is_featured
) VALUES 
-- Text to Image Generation
(
    'text-to-image',
    'Text to Image',
    'Generate stunning images from text descriptions using AI',
    'generation',
    'fal-ai/stable-diffusion-xl-lightning',
    2,
    15,
    '{
        "prompt": {"type": "string", "required": true, "description": "Text description of the image"},
        "negative_prompt": {"type": "string", "required": false, "description": "What to avoid in the image"},
        "width": {"type": "number", "default": 1024, "min": 512, "max": 2048, "step": 64},
        "height": {"type": "number", "default": 1024, "min": 512, "max": 2048, "step": 64},
        "num_inference_steps": {"type": "number", "default": 4, "min": 1, "max": 8},
        "guidance_scale": {"type": "number", "default": 1.0, "min": 0.1, "max": 2.0, "step": 0.1}
    }',
    true
),

-- Background Remover
(
    'background-remover',
    'Background Remover',
    'Automatically remove backgrounds from images with AI precision',
    'editing',
    'fal-ai/birefnet',
    1,
    10,
    '{
        "model": {"type": "select", "default": "General Use (Light)", "options": ["General Use (Light)", "General Use (Heavy)", "Portrait", "DIS5K"]}
    }',
    true
),

-- Image Upscaler
(
    'image-upscaler',
    'Image Upscaler',
    'Enhance image resolution up to 4x without losing quality',
    'enhancement',
    'fal-ai/clarity-upscaler',
    1,
    20,
    '{
        "scale": {"type": "select", "default": 2, "options": [2, 4]},
        "dynamic": {"type": "number", "default": 6, "min": 1, "max": 50},
        "creativity": {"type": "number", "default": 0.35, "min": 0, "max": 1, "step": 0.05},
        "resemblance": {"type": "number", "default": 0.6, "min": 0, "max": 1, "step": 0.05}
    }',
    true
),

-- Face Enhancement
(
    'face-enhancer',
    'Face Enhancer',
    'Enhance and restore facial features in photos',
    'enhancement',
    'fal-ai/face-to-many',
    2,
    25,
    '{
        "mixing_coefficient": {"type": "number", "default": 0.93, "min": 0, "max": 1, "step": 0.01},
        "enable_safety_checker": {"type": "boolean", "default": true}
    }',
    false
),

-- Style Transfer
(
    'style-transfer',
    'Style Transfer',
    'Apply artistic styles to your images using AI',
    'artistic',
    'fal-ai/stable-diffusion-xl-lightning',
    2,
    20,
    '{
        "prompt": {"type": "string", "required": true, "description": "Style description"},
        "strength": {"type": "number", "default": 0.8, "min": 0.1, "max": 1.0, "step": 0.1},
        "guidance_scale": {"type": "number", "default": 7.5, "min": 1, "max": 20, "step": 0.5}
    }',
    false
);

-- Insert corresponding parameters
INSERT INTO tool_parameters (
    tool_id, parameter_name, parameter_type, display_name, 
    description, default_value, is_required, display_order
) VALUES 
-- Text to Image parameters
('text-to-image', 'prompt', 'string', 'Prompt', 'Describe what you want to generate', '', true, 1),
('text-to-image', 'negative_prompt', 'string', 'Negative Prompt', 'What to avoid in the image', '', false, 2),
('text-to-image', 'width', 'number', 'Width', 'Image width in pixels', '1024', false, 3),
('text-to-image', 'height', 'number', 'Height', 'Image height in pixels', '1024', false, 4),

-- Background Remover parameters
('background-remover', 'model', 'select', 'Model Type', 'Choose the best model for your image type', 'General Use (Light)', false, 1),

-- Image Upscaler parameters
('image-upscaler', 'scale', 'select', 'Scale Factor', 'How much to upscale the image', '2', false, 1),
('image-upscaler', 'creativity', 'range', 'Creativity', 'How creative the AI should be', '0.35', false, 2),

-- Face Enhancer parameters
('face-enhancer', 'mixing_coefficient', 'range', 'Enhancement Strength', 'How much to enhance the face', '0.93', false, 1),

-- Style Transfer parameters
('style-transfer', 'prompt', 'string', 'Style Description', 'Describe the artistic style to apply', '', true, 1),
('style-transfer', 'strength', 'range', 'Style Strength', 'How strongly to apply the style', '0.8', false, 2);
