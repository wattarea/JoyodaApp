-- Create useful functions and triggers for the application

-- Function to update user credits after transaction
CREATE OR REPLACE FUNCTION update_user_credits()
RETURNS TRIGGER AS $$
BEGIN
    -- Update user credits based on transaction
    UPDATE users 
    SET credits = credits + NEW.amount,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.user_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update user credits when transaction is completed
DROP TRIGGER IF EXISTS trigger_update_credits ON credit_transactions;
CREATE TRIGGER trigger_update_credits
    AFTER INSERT ON credit_transactions
    FOR EACH ROW
    WHEN (NEW.status = 'completed')
    EXECUTE FUNCTION update_user_credits();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to update updated_at on relevant tables
DROP TRIGGER IF EXISTS trigger_users_updated_at ON users;
CREATE TRIGGER trigger_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_preferences_updated_at ON user_preferences;
CREATE TRIGGER trigger_preferences_updated_at
    BEFORE UPDATE ON user_preferences
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to check if user has enough credits
CREATE OR REPLACE FUNCTION check_user_credits(user_id_param INTEGER, credits_needed INTEGER)
RETURNS BOOLEAN AS $$
DECLARE
    current_credits INTEGER;
BEGIN
    SELECT credits INTO current_credits FROM users WHERE id = user_id_param;
    RETURN current_credits >= credits_needed;
END;
$$ LANGUAGE plpgsql;

-- Function to get user's monthly usage
CREATE OR REPLACE FUNCTION get_monthly_usage(user_id_param INTEGER)
RETURNS TABLE(
    credits_used INTEGER,
    images_processed INTEGER,
    most_used_tool TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(SUM(ABS(ct.amount)), 0)::INTEGER as credits_used,
        COUNT(ipj.id)::INTEGER as images_processed,
        (SELECT tus.tool_name 
         FROM tool_usage_stats tus 
         WHERE tus.user_id = user_id_param 
           AND tus.created_at >= DATE_TRUNC('month', CURRENT_DATE)
         GROUP BY tus.tool_name 
         ORDER BY COUNT(*) DESC 
         LIMIT 1) as most_used_tool
    FROM credit_transactions ct
    LEFT JOIN image_processing_jobs ipj ON ct.user_id = ipj.user_id 
        AND ipj.created_at >= DATE_TRUNC('month', CURRENT_DATE)
    WHERE ct.user_id = user_id_param 
      AND ct.transaction_type = 'usage'
      AND ct.created_at >= DATE_TRUNC('month', CURRENT_DATE);
END;
$$ LANGUAGE plpgsql;
