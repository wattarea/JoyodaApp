-- Insert test documents for the current user
-- First, let's get the user ID for the email (replace with actual email)
DO $$
DECLARE
    user_uuid UUID;
BEGIN
    -- Get the user ID from the users table (adjust email as needed)
    SELECT id INTO user_uuid FROM users WHERE email = 'selman.oniva@gmail.com' LIMIT 1;
    
    -- If user doesn't exist, create a basic user record
    IF user_uuid IS NULL THEN
        INSERT INTO users (id, email, full_name, credits, created_at, updated_at)
        VALUES (
            gen_random_uuid(),
            'selman.oniva@gmail.com',
            'Selman Manada',
            6,
            NOW(),
            NOW()
        )
        RETURNING id INTO user_uuid;
    END IF;
    
    -- Insert sample tool executions
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
    (
        gen_random_uuid(),
        user_uuid,
        'text-to-image',
        NULL,
        'https://fal.media/files/elephant/sample-generated-image-1.jpg',
        'completed',
        1,
        15,
        NOW() - INTERVAL '2 days',
        NOW() - INTERVAL '2 days'
    ),
    (
        gen_random_uuid(),
        user_uuid,
        'background-remover',
        'https://fal.media/files/elephant/input-image-1.jpg',
        'https://fal.media/files/elephant/background-removed-1.png',
        'completed',
        1,
        8,
        NOW() - INTERVAL '1 day',
        NOW() - INTERVAL '1 day'
    );
    
    -- Insert sample image processing jobs
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
    (
        gen_random_uuid(),
        user_uuid,
        'image-upscaler',
        'Image Upscaler',
        'https://fal.media/files/elephant/input-small.jpg',
        'https://fal.media/files/elephant/upscaled-image.jpg',
        'completed',
        2,
        25,
        NOW() - INTERVAL '3 hours',
        NOW() - INTERVAL '3 hours'
    );
    
    -- Update user credits to reflect usage
    UPDATE users 
    SET credits = credits - 4,
        updated_at = NOW()
    WHERE id = user_uuid;
    
END $$;
