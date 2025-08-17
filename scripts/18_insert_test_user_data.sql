-- Insert test tool executions for the current user
-- This will create 2 completed image generations to show in My Documents

-- First, let's insert a text-to-image generation
INSERT INTO tool_executions (
    user_id,
    tool_id,
    execution_id,
    input_parameters,
    output_file_url,
    status,
    credits_used,
    processing_time_seconds,
    created_at,
    completed_at,
    fal_response
) VALUES (
    (SELECT id FROM users WHERE email = (SELECT email FROM auth.users LIMIT 1)),
    'text-to-image',
    'exec_' || generate_random_uuid(),
    '{"prompt": "A beautiful sunset over mountains", "width": 1024, "height": 1024}',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1024&h=1024&fit=crop',
    'completed',
    1,
    15,
    NOW() - INTERVAL '2 days',
    NOW() - INTERVAL '2 days' + INTERVAL '15 seconds',
    '{"status": "success", "output": {"url": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1024&h=1024&fit=crop"}}'
);

-- Second, let's insert a background removal job
INSERT INTO tool_executions (
    user_id,
    tool_id,
    execution_id,
    input_file_url,
    output_file_url,
    status,
    credits_used,
    processing_time_seconds,
    created_at,
    completed_at,
    fal_response
) VALUES (
    (SELECT id FROM users WHERE email = (SELECT email FROM auth.users LIMIT 1)),
    'background-remover',
    'exec_' || generate_random_uuid(),
    'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=500&h=500&fit=crop&bg=transparent',
    'completed',
    1,
    8,
    NOW() - INTERVAL '1 day',
    NOW() - INTERVAL '1 day' + INTERVAL '8 seconds',
    '{"status": "success", "output": {"url": "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=500&h=500&fit=crop&bg=transparent"}}'
);

-- Also insert corresponding credit transactions
INSERT INTO credit_transactions (
    user_id,
    transaction_type,
    amount,
    description,
    tool_used,
    status,
    created_at
) VALUES 
(
    (SELECT id FROM users WHERE email = (SELECT email FROM auth.users LIMIT 1)),
    'usage',
    -1,
    'Text to Image generation',
    'text-to-image',
    'completed',
    NOW() - INTERVAL '2 days'
),
(
    (SELECT id FROM users WHERE email = (SELECT email FROM auth.users LIMIT 1)),
    'usage',
    -1,
    'Background removal',
    'background-remover',
    'completed',
    NOW() - INTERVAL '1 day'
);
