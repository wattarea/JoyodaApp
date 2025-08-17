-- Create credit_transactions table for tracking credit purchases and usage
CREATE TABLE IF NOT EXISTS credit_transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    transaction_type VARCHAR(20) NOT NULL CHECK (transaction_type IN ('purchase', 'usage', 'refund', 'bonus')),
    amount INTEGER NOT NULL, -- Positive for credits added, negative for credits used
    description TEXT NOT NULL,
    cost_usd DECIMAL(10,2), -- Cost in USD for purchases, NULL for usage
    tool_used VARCHAR(100), -- Tool name for usage transactions
    status VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    stripe_payment_id VARCHAR(255), -- For tracking Stripe payments
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_credit_transactions_user_id ON credit_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_type ON credit_transactions(transaction_type);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_created_at ON credit_transactions(created_at);

-- Insert sample transaction data
INSERT INTO credit_transactions (user_id, transaction_type, amount, description, cost_usd, status) 
VALUES 
    (1, 'purchase', 50, 'Starter Pack - 50 Credits', 9.00, 'completed'),
    (1, 'usage', -1, 'Background Remover', NULL, 'completed'),
    (1, 'usage', -1, 'Image Upscaler', NULL, 'completed'),
    (2, 'purchase', 150, 'Professional Pack - 150 Credits', 24.00, 'completed'),
    (2, 'usage', -2, 'Style Transfer', NULL, 'completed'),
    (2, 'usage', -1, 'Background Remover', NULL, 'completed')
ON CONFLICT DO NOTHING;
