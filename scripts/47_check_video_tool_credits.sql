-- Check current credit costs for video tools
SELECT 
    tool_id,
    name,
    credits_per_use,
    category,
    fal_model_id,
    is_active
FROM ai_tools 
WHERE category IN ('text-to-video', 'image-to-video') 
   OR name ILIKE '%video%'
ORDER BY name;

-- Check recent credit transactions for video tools
SELECT 
    ct.id,
    ct.user_id,
    ct.amount,
    ct.description,
    ct.tool_used,
    ct.transaction_type,
    ct.created_at
FROM credit_transactions ct
WHERE ct.tool_used ILIKE '%video%' 
   OR ct.description ILIKE '%video%'
ORDER BY ct.created_at DESC
LIMIT 10;

-- Check tool executions for video tools
SELECT 
    te.id,
    te.tool_id,
    te.credits_used,
    te.status,
    te.created_at,
    at.name as tool_name,
    at.credits_per_use
FROM tool_executions te
JOIN ai_tools at ON te.tool_id = at.tool_id
WHERE at.category IN ('text-to-video', 'image-to-video')
   OR at.name ILIKE '%video%'
ORDER BY te.created_at DESC
LIMIT 10;
