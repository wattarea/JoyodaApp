SELECT 
    tool_id,
    name,
    fal_model_id,
    category,
    input_parameters,
    description
FROM ai_tools 
WHERE tool_id = 'text-to-video-kling' OR name LIKE '%Text to Video%';
