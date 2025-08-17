-- Insert sample tool executions for the current user
-- This will create 2 documents as requested by the user

-- First, get the user ID (assuming the user email is the one currently logged in)
-- We'll use a placeholder user_id that should be replaced with the actual user ID

INSERT INTO tool_executions (
  id,
  user_id,
  tool_id,
  input_file_url,
  output_file_url,
  status,
  credits_used,
  processing_time_seconds,
  created_at,
  updated_at
) VALUES 
-- Text-to-Image generation
(
  gen_random_uuid(),
  (SELECT id FROM users WHERE email = (SELECT email FROM auth.users LIMIT 1)),
  'text-to-image',
  null,
  'https://fal.media/files/elephant/sample-generated-image-1.jpg',
  'completed',
  1,
  15,
  NOW() - INTERVAL '2 days',
  NOW() - INTERVAL '2 days'
),
-- Background removal
(
  gen_random_uuid(),
  (SELECT id FROM users WHERE email = (SELECT email FROM auth.users LIMIT 1)),
  'background-remover',
  'https://fal.media/files/elephant/sample-input-image.jpg',
  'https://fal.media/files/elephant/sample-bg-removed.png',
  'completed',
  1,
  8,
  NOW() - INTERVAL '1 day',
  NOW() - INTERVAL '1 day'
);

-- Also insert some sample image processing jobs for variety
INSERT INTO image_processing_jobs (
  id,
  user_id,
  tool_id,
  tool_name,
  input_image_url,
  output_image_url,
  status,
  credits_used,
  processing_time_seconds,
  created_at,
  updated_at
) VALUES 
-- Image upscaler
(
  gen_random_uuid(),
  (SELECT id FROM users WHERE email = (SELECT email FROM auth.users LIMIT 1)),
  'image-upscaler',
  'Image Upscaler',
  'https://fal.media/files/elephant/sample-low-res.jpg',
  'https://fal.media/files/elephant/sample-upscaled.jpg',
  'completed',
  2,
  25,
  NOW() - INTERVAL '3 hours',
  NOW() - INTERVAL '3 hours'
);
