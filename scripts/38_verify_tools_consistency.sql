-- Verify all tools are properly configured and consistent
SELECT 
  tool_id,
  name,
  description,
  category,
  credits_per_use,
  is_active,
  is_featured
FROM ai_tools 
WHERE is_active = true
ORDER BY name;

-- Update any missing or inconsistent tool data
UPDATE ai_tools SET
  name = CASE tool_id
    WHEN 'age-progression' THEN 'Age Progression/Regression'
    WHEN 'background-remover' THEN 'Background Remover'
    WHEN 'face-enhancer' THEN 'Face Enhancer'
    WHEN 'image-upscaler' THEN 'Image Upscaler'
    WHEN 'style-transfer' THEN 'Style Transfer'
    WHEN 'text-to-image' THEN 'Text to Image'
    WHEN 'face-swap' THEN 'Face Swap'
    WHEN 'virtual-tryon' THEN 'Virtual Try-On'
    ELSE name
  END,
  description = CASE tool_id
    WHEN 'age-progression' THEN 'Transform faces to show aging or youth progression using advanced AI'
    WHEN 'background-remover' THEN 'Automatically remove backgrounds from images with AI precision'
    WHEN 'face-enhancer' THEN 'Enhance and restore facial features in photos'
    WHEN 'image-upscaler' THEN 'Enhance image resolution up to 4x without losing quality'
    WHEN 'style-transfer' THEN 'Apply artistic styles to your images using AI'
    WHEN 'text-to-image' THEN 'Generate stunning images from text descriptions using AI'
    WHEN 'face-swap' THEN 'Generate consistent character appearances across multiple images'
    WHEN 'virtual-tryon' THEN 'Try on clothing virtually using AI Upload person and garment'
    ELSE description
  END,
  is_active = true
WHERE tool_id IN ('age-progression', 'background-remover', 'face-enhancer', 'image-upscaler', 'style-transfer', 'text-to-image', 'face-swap', 'virtual-tryon');
