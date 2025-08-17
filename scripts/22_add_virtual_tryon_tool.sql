-- Insert Virtual Try-On tool into ai_tools table
INSERT INTO ai_tools (
    tool_id,
    name,
    description,
    category,
    fal_model_id,
    credits_per_use,
    icon_name,
    is_active,
    is_featured,
    processing_time_seconds,
    success_rate,
    created_at,
    updated_at
) VALUES (
    'virtual-tryon',
    'Virtual Try-On',
    'Try on clothing virtually using AI. Upload a photo of yourself and a garment to see how it looks when worn. Perfect for online shopping and fashion experimentation.',
    'fashion',
    'fal-ai/fashn/tryon/v1.6',
    3,
    'Shirt',
    true,
    true,
    45,
    95.0,
    NOW(),
    NOW()
);

-- Insert tool parameters for Virtual Try-On
INSERT INTO tool_parameters (
    tool_id,
    parameter_name,
    parameter_type,
    default_value,
    min_value,
    max_value,
    description,
    is_required,
    created_at,
    updated_at
) VALUES 
(
    (SELECT id FROM ai_tools WHERE tool_id = 'virtual-tryon'),
    'person_image_url',
    'string',
    NULL,
    NULL,
    NULL,
    'URL of the person image to try clothes on',
    true,
    NOW(),
    NOW()
),
(
    (SELECT id FROM ai_tools WHERE tool_id = 'virtual-tryon'),
    'garment_image_url',
    'string',
    NULL,
    NULL,
    NULL,
    'URL of the garment image to try on',
    true,
    NOW(),
    NOW()
),
(
    (SELECT id FROM ai_tools WHERE tool_id = 'virtual-tryon'),
    'garment_type',
    'string',
    'top',
    NULL,
    NULL,
    'Type of garment (top, bottom, dress, outerwear)',
    false,
    NOW(),
    NOW()
);
