-- Check Virtual Try-On tool configuration
SELECT tool_id, name, credits_per_use, fal_model_id 
FROM ai_tools 
WHERE tool_id = 'virtual-tryon' OR name ILIKE '%try%on%';

-- Check recent tool executions for Virtual Try-On
SELECT id, user_id, tool_id, credits_used, status, created_at, completed_at
FROM tool_executions 
WHERE tool_id = 'virtual-tryon' 
ORDER BY created_at DESC 
LIMIT 10;

-- Check recent credit transactions
SELECT id, user_id, amount, transaction_type, tool_used, description, created_at
FROM credit_transactions 
WHERE tool_used = 'virtual-tryon' OR description ILIKE '%try%on%'
ORDER BY created_at DESC 
LIMIT 10;

-- Check current user credits (assuming user_id = 1, adjust if needed)
SELECT id, email, credits 
FROM users 
WHERE credits BETWEEN 990 AND 1010
ORDER BY updated_at DESC;
