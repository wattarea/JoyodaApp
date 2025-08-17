-- Check which tools have model IDs that aren't supported by the API route
SELECT 
    tool_id,
    name,
    fal_model_id,
    category,
    is_active
FROM ai_tools 
WHERE is_active = true
ORDER BY tool_id;

-- List of currently supported models in API route:
-- 'fal-ai/birefnet'
-- 'fal-ai/image-editing/face-enhancement'
-- 'fal-ai/image-editing/plushie-style'
-- 'fal-ai/imagen4/preview'
-- 'fal-ai/kling-video/v1.6/pro/image-to-video'
-- 'fal-ai/minimax/hailuo-02/standard/image-to-video'
-- 'fal-ai/veo2'
-- 'fal-ai/ideogram/character'
-- 'fal-ai/image-editing/age-progression'
-- 'fal-ai/real-esrgan'

-- Check for any tools with unsupported model IDs
SELECT 
    tool_id,
    name,
    fal_model_id,
    'UNSUPPORTED' as status
FROM ai_tools 
WHERE is_active = true
AND fal_model_id NOT IN (
    'fal-ai/birefnet',
    'fal-ai/image-editing/face-enhancement',
    'fal-ai/image-editing/plushie-style',
    'fal-ai/imagen4/preview',
    'fal-ai/kling-video/v1.6/pro/image-to-video',
    'fal-ai/minimax/hailuo-02/standard/image-to-video',
    'fal-ai/veo2',
    'fal-ai/ideogram/character',
    'fal-ai/image-editing/age-progression',
    'fal-ai/real-esrgan'
);
