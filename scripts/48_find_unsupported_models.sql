-- Check all tools and their fal_model_id to find unsupported ones
SELECT 
    tool_id,
    name,
    fal_model_id,
    category,
    is_active,
    CASE 
        WHEN fal_model_id IN (
            'fal-ai/imagen4/preview',
            'fal-ai/birefnet',
            'fal-ai/clarity-upscaler',
            'fal-ai/image-editing/age-progression',
            'fal-ai/image-editing/face-enhancement',
            'fal-ai/image-editing/plushie-style',
            'fal-ai/fashn/tryon/v1.5',
            'fal-ai/ideogram/character',
            'fal-ai/kling-video/v1.6/pro/image-to-video',
            'fal-ai/minimax/hailuo-02/standard/image-to-video'
        ) THEN 'SUPPORTED'
        ELSE 'UNSUPPORTED'
    END as support_status
FROM ai_tools 
WHERE is_active = true
ORDER BY support_status DESC, name;

-- Show only unsupported models
SELECT 
    tool_id,
    name,
    fal_model_id,
    category
FROM ai_tools 
WHERE is_active = true
AND fal_model_id NOT IN (
    'fal-ai/imagen4/preview',
    'fal-ai/birefnet',
    'fal-ai/clarity-upscaler',
    'fal-ai/image-editing/age-progression',
    'fal-ai/image-editing/face-enhancement',
    'fal-ai/image-editing/plushie-style',
    'fal-ai/fashn/tryon/v1.5',
    'fal-ai/ideogram/character',
    'fal-ai/kling-video/v1.6/pro/image-to-video',
    'fal-ai/minimax/hailuo-02/standard/image-to-video'
);
