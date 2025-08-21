-- Add image_url field to ai_tools table for dynamic tool images
ALTER TABLE ai_tools ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Add comment for the new field
COMMENT ON COLUMN ai_tools.image_url IS 'URL to the tool image/icon for display in UI';

-- Update existing tools with placeholder image URLs (optional)
UPDATE ai_tools SET image_url = '/placeholder.svg?height=64&width=64&query=' || name WHERE image_url IS NULL;
