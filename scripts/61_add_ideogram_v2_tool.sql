-- Add Ideogram V2 text-to-image generator tool
INSERT INTO ai_tools (
  tool_id,
  name,
  description,
  category,
  fal_model_id,
  credits_per_use, -- Fixed column name from credits_required to credits_per_use
  is_active
) VALUES (
  'ideogram-v2-generator',
  'Ideogram V2 Generator',
  'Generate high-quality images, posters, and logos with exceptional typography handling using Ideogram V2',
  'text-to-image',
  'fal-ai/ideogram/v2',
  3,
  true
);
