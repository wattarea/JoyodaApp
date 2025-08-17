INSERT INTO ai_tools (
    tool_id,
    name,
    description,
    category,
    credits_per_use,
    fal_model_id,
    api_provider,
    is_active,
    is_featured,
    processing_time_seconds,
    success_rate,
    created_at,
    updated_at
) VALUES (
    'text-to-video-kling',
    'Text to Video (Kling 1.6)',
    'Transform text prompts into high-quality videos using advanced AI',
    'video-generation',
    10,
    'fal-ai/kling-video/v1.6/pro/image-to-video',
    'fal.ai',
    true,
    true,
    45,
    95.0,
    NOW(),
    NOW()
) ON CONFLICT (tool_id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    category = EXCLUDED.category,
    credits_per_use = EXCLUDED.credits_per_use,
    fal_model_id = EXCLUDED.fal_model_id,
    api_provider = EXCLUDED.api_provider,
    is_active = EXCLUDED.is_active,
    is_featured = EXCLUDED.is_featured,
    processing_time_seconds = EXCLUDED.processing_time_seconds,
    success_rate = EXCLUDED.success_rate,
    updated_at = NOW();

-- Add tool parameters for Text to Video (Kling 1.6)
INSERT INTO tool_parameters (
    tool_id,
    parameter_name,
    parameter_type,
    is_required,
    default_value,
    description,
    created_at
) VALUES 
    ((SELECT id FROM ai_tools WHERE tool_id = 'text-to-video-kling'), 'prompt', 'text', true, '', 'Text description of the video to generate', NOW()),
    ((SELECT id FROM ai_tools WHERE tool_id = 'text-to-video-kling'), 'image_url', 'file', false, '', 'Optional starting image for video generation', NOW()),
    ((SELECT id FROM ai_tools WHERE tool_id = 'text-to-video-kling'), 'duration', 'select', false, '5', 'Video duration in seconds (5 or 10)', NOW()),
    ((SELECT id FROM ai_tools WHERE tool_id = 'text-to-video-kling'), 'aspect_ratio', 'select', false, '16:9', 'Video aspect ratio', NOW()),
    ((SELECT id FROM ai_tools WHERE tool_id = 'text-to-video-kling'), 'negative_prompt', 'text', false, '', 'What to avoid in the video', NOW()),
    ((SELECT id FROM ai_tools WHERE tool_id = 'text-to-video-kling'), 'cfg_scale', 'number', false, '7.5', 'Guidance scale for generation quality', NOW())
ON CONFLICT (tool_id, parameter_name) DO UPDATE SET
    parameter_type = EXCLUDED.parameter_type,
    is_required = EXCLUDED.is_required,
    default_value = EXCLUDED.default_value,
    description = EXCLUDED.description;
