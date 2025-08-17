-- Insert test documents for the current user
-- First, let's get the user ID for the email (replace with actual email)
DO $$
DECLARE
    user_record RECORD;
    test_user_id INTEGER;
BEGIN
    -- Get user by email (you may need to update this email)
    SELECT id INTO test_user_id FROM users WHERE email = 'selman.oniva@gmail.com' LIMIT 1;
    
    -- If user doesn't exist, create one
    IF test_user_id IS NULL THEN
        INSERT INTO users (email, first_name, last_name, credits, created_at, updated_at)
        VALUES ('selman.oniva@gmail.com', 'Selman', 'Manada', 6, NOW(), NOW())
        RETURNING id INTO test_user_id;
    END IF;
    
    -- Insert test tool executions (documents)
    INSERT INTO tool_executions (
        user_id,
        tool_id,
        execution_id,
        input_file_url,
        output_file_url,
        status,
        credits_used,
        processing_time_seconds,
        input_parameters,
        created_at,
        completed_at
    ) VALUES 
    (
        test_user_id,
        'text-to-image',
        'exec_' || generate_random_uuid(),
        NULL, -- No input file for text-to-image
        'https://fal.media/files/elephant/generated_image_1.jpg',
        'completed',
        1,
        15,
        '{"prompt": "A beautiful sunset over mountains", "width": 1024, "height": 1024}',
        NOW() - INTERVAL '2 days',
        NOW() - INTERVAL '2 days' + INTERVAL '15 seconds'
    ),
    (
        test_user_id,
        'text-to-image',
        'exec_' || generate_random_uuid(),
        NULL,
        'https://fal.media/files/elephant/generated_image_2.jpg',
        'completed',
        1,
        12,
        '{"prompt": "A futuristic city at night", "width": 1024, "height": 1024}',
        NOW() - INTERVAL '1 day',
        NOW() - INTERVAL '1 day' + INTERVAL '12 seconds'
    );
    
    -- Insert corresponding credit transactions
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
        test_user_id,
        'usage',
        -1,
        'Text to Image generation',
        'text-to-image',
        'completed',
        NOW() - INTERVAL '2 days'
    ),
    (
        test_user_id,
        'usage',
        -1,
        'Text to Image generation',
        'text-to-image',
        'completed',
        NOW() - INTERVAL '1 day'
    );
    
    RAISE NOTICE 'Test documents created for user ID: %', test_user_id;
END $$;
