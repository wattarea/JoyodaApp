-- Create subscription_plans table for managing different pricing tiers
CREATE TABLE IF NOT EXISTS subscription_plans (
    id SERIAL PRIMARY KEY,
    plan_name VARCHAR(50) UNIQUE NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    description TEXT,
    monthly_credits INTEGER NOT NULL,
    price_usd DECIMAL(10,2) NOT NULL,
    features JSONB, -- Store plan features as JSON
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on plan_name for faster lookups
CREATE INDEX IF NOT EXISTS idx_subscription_plans_name ON subscription_plans(plan_name);

-- Insert subscription plan data
INSERT INTO subscription_plans (plan_name, display_name, description, monthly_credits, price_usd, features) 
VALUES 
    ('free', 'Free Plan', 'Perfect for trying out our tools', 10, 0.00, 
     '{"support": "basic", "validity_days": 30, "api_access": false, "priority_processing": false}'),
    ('professional', 'Professional Plan', 'For professionals and creators', 500, 49.00, 
     '{"support": "priority", "validity_days": 60, "api_access": false, "priority_processing": true, "bulk_processing": true}'),
    ('enterprise', 'Enterprise Plan', 'For teams and businesses', 9999, 99.00, 
     '{"support": "24/7", "validity_days": 90, "api_access": true, "priority_processing": true, "bulk_processing": true, "custom_integrations": true}')
ON CONFLICT (plan_name) DO NOTHING;
