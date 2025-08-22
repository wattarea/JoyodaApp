-- Update the nextstep tool to use ideogram character model
UPDATE ai_tools 
SET 
    fal_model_id = 'fal-ai/ideogram/character',
    name = 'Character Generator',
    description = 'Generate consistent character appearances across multiple images. Upload reference images and describe the character you want to create.',
    category = 'character',
    updated_at = NOW()
WHERE tool_id = 'nextstep-image-editor';

-- Verify the update
SELECT tool_id, name, fal_model_id, description, category FROM ai_tools WHERE tool_id = 'nextstep-image-editor';
