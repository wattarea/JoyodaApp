-- Create useful views for analytics and reporting

-- View for user statistics
CREATE OR REPLACE VIEW user_stats AS
SELECT 
    u.id,
    u.email,
    u.first_name,
    u.last_name,
    u.subscription_plan,
    u.credits,
    u.created_at as user_since,
    COUNT(ipj.id) as total_jobs,
    COUNT(CASE WHEN ipj.status = 'completed' THEN 1 END) as completed_jobs,
    COUNT(CASE WHEN ipj.status = 'failed' THEN 1 END) as failed_jobs,
    SUM(CASE WHEN ct.transaction_type = 'purchase' THEN ct.amount ELSE 0 END) as total_credits_purchased,
    SUM(CASE WHEN ct.transaction_type = 'usage' THEN ABS(ct.amount) ELSE 0 END) as total_credits_used,
    SUM(CASE WHEN ct.transaction_type = 'purchase' THEN ct.cost_usd ELSE 0 END) as total_spent_usd
FROM users u
LEFT JOIN image_processing_jobs ipj ON u.id = ipj.user_id
LEFT JOIN credit_transactions ct ON u.id = ct.user_id
GROUP BY u.id, u.email, u.first_name, u.last_name, u.subscription_plan, u.credits, u.created_at;

-- View for tool popularity and performance
CREATE OR REPLACE VIEW tool_analytics AS
SELECT 
    tus.tool_id,
    tus.tool_name,
    COUNT(*) as total_uses,
    COUNT(CASE WHEN tus.success = TRUE THEN 1 END) as successful_uses,
    COUNT(CASE WHEN tus.success = FALSE THEN 1 END) as failed_uses,
    ROUND(AVG(CASE WHEN tus.success = TRUE THEN tus.processing_time_seconds END), 2) as avg_processing_time,
    ROUND(AVG(CASE WHEN tus.user_rating IS NOT NULL THEN tus.user_rating END), 2) as avg_rating,
    COUNT(DISTINCT tus.user_id) as unique_users
FROM tool_usage_stats tus
GROUP BY tus.tool_id, tus.tool_name
ORDER BY total_uses DESC;

-- View for monthly revenue and usage
CREATE OR REPLACE VIEW monthly_metrics AS
SELECT 
    DATE_TRUNC('month', ct.created_at) as month,
    COUNT(DISTINCT ct.user_id) as active_users,
    SUM(CASE WHEN ct.transaction_type = 'purchase' THEN ct.cost_usd ELSE 0 END) as revenue_usd,
    SUM(CASE WHEN ct.transaction_type = 'purchase' THEN ct.amount ELSE 0 END) as credits_sold,
    SUM(CASE WHEN ct.transaction_type = 'usage' THEN ABS(ct.amount) ELSE 0 END) as credits_used,
    COUNT(CASE WHEN ct.transaction_type = 'usage' THEN 1 END) as total_tool_uses
FROM credit_transactions ct
GROUP BY DATE_TRUNC('month', ct.created_at)
ORDER BY month DESC;
