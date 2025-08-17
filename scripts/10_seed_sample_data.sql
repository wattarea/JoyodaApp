-- Additional sample data for testing and development

-- Add more sample users with different subscription levels
INSERT INTO users (email, password_hash, first_name, last_name, credits, subscription_plan, email_verified) 
VALUES 
    ('creator@example.com', '$2b$10$example_hash_here', 'Creative', 'User', 75, 'free', TRUE),
    ('business@example.com', '$2b$10$example_hash_here', 'Business', 'Owner', 300, 'professional', TRUE),
    ('developer@example.com', '$2b$10$example_hash_here', 'Dev', 'Team', 1000, 'enterprise', TRUE)
ON CONFLICT (email) DO NOTHING;

-- Add more credit transactions for realistic data
INSERT INTO credit_transactions (user_id, transaction_type, amount, description, cost_usd, tool_used, status) 
VALUES 
    (4, 'purchase', 50, 'Starter Pack - 50 Credits', 9.00, NULL, 'completed'),
    (4, 'usage', -1, 'Background Remover', NULL, 'background-remover', 'completed'),
    (4, 'usage', -2, 'Style Transfer', NULL, 'style-transfer', 'completed'),
    (5, 'purchase', 150, 'Professional Pack - 150 Credits', 24.00, NULL, 'completed'),
    (5, 'usage', -1, 'Image Upscaler', NULL, 'image-upscaler', 'completed'),
    (5, 'usage', -2, 'Color Corrector', NULL, 'color-corrector', 'completed'),
    (6, 'purchase', 500, 'Enterprise Pack - 500 Credits', 79.00, NULL, 'completed'),
    (6, 'usage', -1, 'Background Remover', NULL, 'background-remover', 'completed'),
    (6, 'usage', -3, 'Image Restoration', NULL, 'image-restoration', 'completed')
ON CONFLICT DO NOTHING;

-- Add more processing jobs
INSERT INTO image_processing_jobs (user_id, tool_id, tool_name, credits_used, status, processing_time_seconds, completed_at) 
VALUES 
    (4, 'background-remover', 'Background Remover', 1, 'completed', 22, CURRENT_TIMESTAMP - INTERVAL '3 hours'),
    (4, 'style-transfer', 'Style Transfer', 2, 'completed', 38, CURRENT_TIMESTAMP - INTERVAL '2 hours'),
    (5, 'image-upscaler', 'Image Upscaler', 1, 'completed', 28, CURRENT_TIMESTAMP - INTERVAL '1 hour'),
    (5, 'color-corrector', 'Color Corrector', 2, 'completed', 15, CURRENT_TIMESTAMP - INTERVAL '30 minutes'),
    (6, 'background-remover', 'Background Remover', 1, 'completed', 18, CURRENT_TIMESTAMP - INTERVAL '4 hours'),
    (6, 'image-restoration', 'Image Restoration', 3, 'completed', 65, CURRENT_TIMESTAMP - INTERVAL '1 hour')
ON CONFLICT DO NOTHING;

-- Add user preferences for new users
INSERT INTO user_preferences (user_id, email_notifications, low_credit_warnings, feature_updates, marketing_emails) 
VALUES 
    (4, TRUE, TRUE, TRUE, FALSE),
    (5, TRUE, TRUE, FALSE, TRUE),
    (6, FALSE, TRUE, TRUE, FALSE)
ON CONFLICT (user_id) DO NOTHING;

-- Add more tool usage statistics
INSERT INTO tool_usage_stats (tool_id, tool_name, user_id, processing_time_seconds, success, user_rating) 
VALUES 
    ('background-remover', 'Background Remover', 4, 22, TRUE, 4),
    ('style-transfer', 'Style Transfer', 4, 38, TRUE, 5),
    ('image-upscaler', 'Image Upscaler', 5, 28, TRUE, 4),
    ('color-corrector', 'Color Corrector', 5, 15, TRUE, 5),
    ('background-remover', 'Background Remover', 6, 18, TRUE, 5),
    ('image-restoration', 'Image Restoration', 6, 65, TRUE, 4),
    ('smart-crop', 'Smart Crop', 4, 12, TRUE, 4),
    ('face-enhancer', 'Face Enhancer', 5, 42, TRUE, 3)
ON CONFLICT DO NOTHING;
