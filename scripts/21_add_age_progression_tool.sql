-- Add Age Progression/Regression tool to ai_tools table
INSERT INTO ai_tools (
    tool_id,
    name,
    description,
    category,
    fal_model_id,
    api_provider,
    credits_per_use,
    icon_name,
    input_parameters,
    supported_formats,
    max_file_size_mb,
    processing_time_estimate,
    output_format,
    is_active,
    is_featured,
    success_rate,
    rating,
    usage_count,
    created_at,
    updated_at
) VALUES (
    'age-progression',
    'Age Progression/Regression',
    'Transform faces to show aging or youth progression using advanced AI. Upload a portrait photo and adjust the age to see realistic aging or youth effects.',
    'image-editing',
    'fal-ai/image-editing/age-progression',
    'fal',
    2,
    'Clock',
    '{
        "age_target": {
            "type": "number",
            "label": "Target Age",
            "description": "The target age for the transformation (5-80 years)",
            "min": 5,
            "max": 80,
            "default": 30,
            "step": 1
        },
        "strength": {
            "type": "number",
            "label": "Transformation Strength",
            "description": "How strong the age transformation should be (0.1-1.0)",
            "min": 0.1,
            "max": 1.0,
            "default": 0.8,
            "step": 0.1
        }
    }',
    '["jpg", "jpeg", "png", "webp"]',
    10,
    15,
    'png',
    true,
    true,
    0.92,
    4.6,
    0,
    NOW(),
    NOW()
);

-- Add tool parameters for age progression
INSERT INTO tool_parameters (
    tool_id,
    parameter_name,
    display_name,
    description,
    parameter_type,
    default_value,
    min_value,
    max_value,
    step_value,
    is_required,
    display_order,
    created_at
) VALUES 
(
    'age-progression',
    'age_target',
    'Target Age',
    'The target age for the transformation (5-80 years)',
    'number',
    '30',
    5,
    80,
    1,
    true,
    1,
    NOW()
),
(
    'age-progression',
    'strength',
    'Transformation Strength',
    'How strong the age transformation should be (0.1-1.0)',
    'number',
    '0.8',
    0.1,
    1.0,
    0.1,
    true,
    2,
    NOW()
);
