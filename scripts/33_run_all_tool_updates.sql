-- Apply the comprehensive tool updates to ensure database consistency
-- This script runs the tool API updates we created earlier

-- First, run the comprehensive tool update script
\i scripts/32_update_all_tools_api_info.sql

-- Verify all tools are properly configured
SELECT 
    tool_id,
    name,
    category,
    fal_model_id,
    api_provider,
    credits_per_use,
    is_active,
    is_featured
FROM ai_tools 
ORDER BY name;

-- Check that all credit costs are properly set
SELECT 
    tool_id,
    name,
    credits_per_use,
    CASE 
        WHEN credits_per_use IS NULL THEN 'MISSING CREDIT COST'
        WHEN credits_per_use <= 0 THEN 'INVALID CREDIT COST'
        ELSE 'OK'
    END as credit_status
FROM ai_tools
ORDER BY credits_per_use;

-- Verify API provider consistency
SELECT 
    api_provider,
    COUNT(*) as tool_count,
    AVG(credits_per_use) as avg_credits
FROM ai_tools 
WHERE is_active = true
GROUP BY api_provider;
