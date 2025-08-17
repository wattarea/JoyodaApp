-- Add Text to Video (Kling 1.6) tool to ai_tools table
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
    icon_name,
    processing_time_estimate,
    success_rate,
    max_file_size_mb,
    supported_formats,
    output_format,
    input_parameters,
    usage_count,
    rating,
    created_at,
    updated_at
) VALUES (
    'text-to-video-kling',
    'Text to Video (Kling 1.6)',
    'Transform static images into dynamic videos with AI-powered motion generation',
    'image-to-video',
    'fal-ai/kling-video/v1.6/pro/image-to-video',
    'fal.ai',
    10,
    true,
    true,
    'video',
    45,
    98.5,
    10,
    '["jpg", "jpeg", "png", "webp", "gif"]'::jsonb,
    'mp4',
    '{
        "image_url": {
            "type": "file",
            "required": true,
            "description": "Source image to animate"
        },
        "prompt": {
            "type": "text",
            "required": true,
            "description": "Describe the motion and animation you want to see"
        },
        "duration": {
            "type": "select",
            "required": false,
            "default": "5",
            "options": ["5", "10"],
            "description": "Video duration in seconds"
        },
        "aspect_ratio": {
            "type": "select",
            "required": false,
            "default": "16:9",
            "options": ["16:9", "9:16", "1:1", "4:3", "3:4"],
            "description": "Video aspect ratio"
        },
        "negative_prompt": {
            "type": "text",
            "required": false,
            "description": "What to avoid in the video"
        },
        "cfg_scale": {
            "type": "slider",
            "required": false,
            "default": 0.5,
            "min": 0.1,
            "max": 1.0,
            "step": 0.1,
            "description": "Prompt adherence strength"
        }
    }'::jsonb,
    0,
    0.0,
    NOW(),
    NOW()
);

-- Add tool parameters for Text to Video (Kling 1.6)
INSERT INTO tool_parameters (
    tool_id,
    parameter_name,
    display_name,
    parameter_type,
    is_required,
    default_value,
    description,
    display_order
) VALUES 
(
    'text-to-video-kling',
    'image_url',
    'Source Image',
    'file',
    true,
    NULL,
    'Upload an image to animate with AI motion',
    1
),
(
    'text-to-video-kling',
    'prompt',
    'Motion Prompt',
    'textarea',
    true,
    NULL,
    'Describe the motion and animation you want to see in the video',
    2
),
(
    'text-to-video-kling',
    'duration',
    'Video Duration',
    'select',
    false,
    '5',
    'Choose video length: 5 or 10 seconds',
    3
),
(
    'text-to-video-kling',
    'aspect_ratio',
    'Aspect Ratio',
    'select',
    false,
    '16:9',
    'Video dimensions and orientation',
    4
),
(
    'text-to-video-kling',
    'negative_prompt',
    'Negative Prompt',
    'text',
    false,
    NULL,
    'Specify what to avoid in the generated video',
    5
),
(
    'text-to-video-kling',
    'cfg_scale',
    'Prompt Adherence',
    'slider',
    false,
    '0.5',
    'Control how strictly the AI follows your prompt (0.1 = creative, 1.0 = strict)',
    6
);

-- Verify the tool was added successfully
SELECT 
    tool_id,
    name,
    category,
    fal_model_id,
    credits_per_use,
    is_active
FROM ai_tools 
WHERE tool_id = 'text-to-video-kling';
