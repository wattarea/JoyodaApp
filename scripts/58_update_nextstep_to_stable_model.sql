-- Update the nextstep tool to use a more reliable model
UPDATE ai_tools 
SET 
    fal_model_id = 'fal-ai/stable-diffusion-xl-lightning',
    name = 'AI Image Editor',
    description = 'Edit and transform images using AI prompts. Upload an image and describe the changes you want to make.',
    updated_at = NOW()
WHERE tool_id = 'nextstep-image-editor';

-- Verify the update
SELECT tool_id, name, fal_model_id, description FROM ai_tools WHERE tool_id = 'nextstep-image-editor';
