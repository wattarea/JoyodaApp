-- Update the Character Generation tool name from "Tutarlı karakter (Face Swap)" to "Face Swap"
UPDATE ai_tools 
SET name = 'Face Swap',
    description = 'Generate consistent character appearances across multiple images using AI. Upload reference images and describe your character to create cohesive visual storytelling.'
WHERE model = 'fal-ai/ideogram/character' 
   OR name LIKE '%Face Swap%' 
   OR name LIKE '%Tutarlı karakter%';

-- Verify the update
SELECT tool_id, name, description, model, credits_per_use 
FROM ai_tools 
WHERE name = 'Face Swap';
