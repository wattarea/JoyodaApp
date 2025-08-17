-- Add Virtual Try-On tool to the database
INSERT INTO ai_tools (
    tool_id,
    name,
    description,
    category,
    api_provider,
    fal_model_id,
    credits_per_use,
    processing_time_estimate,
    success_rate,
    is_active,
    is_featured,
    icon_name,
    input_parameters,
    supported_formats,
    max_file_size_mb,
    output_format,
    created_at,
    updated_at
) VALUES (
    'virtual-tryon',
    'Virtual Try-On',
    'Try on clothing virtually using AI. Upload a person image and garment image to see realistic try-on results with advanced fashion AI technology.',
    'fashion',
    'fal',
    'fal-ai/fashn/tryon/v1.6',
    3,
    30,
    95.0,
    true,
    true,
    'shirt',
    '{"person_image_url": {"type": "file", "required": true, "description": "Upload a photo of the person"}, "garment_image_url": {"type": "file", "required": true, "description": "Upload the garment to try on"}, "garment_type": {"type": "select", "required": false, "options": ["tops", "bottoms", "dresses", "outerwear"], "description": "Type of garment for better results"}}',
    '["jpg", "jpeg", "png", "webp"]',
    10,
    'jpg',
    NOW(),
    NOW()
);

-- Add tool parameters for Virtual Try-On
INSERT INTO tool_parameters (
    tool_id,
    parameter_name,
    display_name,
    parameter_type,
    description,
    is_required,
    display_order,
    created_at
) VALUES 
(
    'virtual-tryon',
    'person_image_url',
    'Person Image',
    'file',
    'Upload a photo of the person who will try on the garment',
    true,
    1,
    NOW()
),
(
    'virtual-tryon',
    'garment_image_url', 
    'Garment Image',
    'file',
    'Upload the clothing item to try on',
    true,
    2,
    NOW()
),
(
    'virtual-tryon',
    'garment_type',
    'Garment Type',
    'select',
    'Select the type of garment for better results',
    false,
    3,
    NOW()
);
