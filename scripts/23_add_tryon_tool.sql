-- Add Virtual Try-On tool to the database
INSERT INTO ai_tools (
    tool_id,
    name,
    description,
    category,
    icon_name,
    fal_model_id,
    credits_per_use,
    processing_time_seconds,
    is_active,
    is_featured,
    created_at,
    updated_at
) VALUES (
    'virtual-tryon',
    'Virtual Try-On',
    'Try on clothes virtually using AI. Upload a person photo and garment image to see how clothing looks when worn.',
    'fashion',
    'Shirt',
    'fal-ai/fashn/tryon/v1.6',
    3,
    45,
    true,
    true,
    NOW(),
    NOW()
);

-- Add tool parameters for Virtual Try-On
INSERT INTO tool_parameters (
    tool_id,
    parameter_name,
    parameter_type,
    default_value,
    is_required,
    description,
    created_at
) VALUES 
(
    (SELECT id FROM ai_tools WHERE tool_id = 'virtual-tryon'),
    'person_image_url',
    'file',
    NULL,
    true,
    'Upload a photo of the person who will try on the garment',
    NOW()
),
(
    (SELECT id FROM ai_tools WHERE tool_id = 'virtual-tryon'),
    'garment_image_url', 
    'file',
    NULL,
    true,
    'Upload an image of the garment to try on',
    NOW()
),
(
    (SELECT id FROM ai_tools WHERE tool_id = 'virtual-tryon'),
    'garment_type',
    'select',
    'tops',
    false,
    'Type of garment being tried on',
    NOW()
);
