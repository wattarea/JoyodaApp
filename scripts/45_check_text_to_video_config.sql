-- Check current configuration of text-to-video tools
SELECT 
    tool_id,
    name,
    fal_model_id,
    category,
    credits_per_use,
    is_active,
    input_parameters
FROM ai_tools 
WHERE tool_id LIKE '%text-to-video%' OR tool_id LIKE '%video%'
ORDER BY created_at DESC;

-- Also check if there are any tools with Kling or Veo models
SELECT 
    tool_id,
    name,
    fal_model_id,
    category
FROM ai_tools 
WHERE fal_model_id LIKE '%kling%' OR fal_model_id LIKE '%veo%'
ORDER BY created_at DESC;
