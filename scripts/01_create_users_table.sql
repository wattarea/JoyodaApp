-- Create users table for authentication and account management
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    company VARCHAR(255),
    credits INTEGER DEFAULT 10,
    subscription_plan VARCHAR(50) DEFAULT 'free',
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Create index on subscription_plan for analytics
CREATE INDEX IF NOT EXISTS idx_users_subscription ON users(subscription_plan);

-- Insert sample user data
INSERT INTO users (email, password_hash, first_name, last_name, credits, subscription_plan, email_verified) 
VALUES 
    ('john.doe@example.com', '$2b$10$example_hash_here', 'John', 'Doe', 10, 'free', TRUE),
    ('jane.smith@example.com', '$2b$10$example_hash_here', 'Jane', 'Smith', 150, 'professional', TRUE),
    ('admin@example.com', '$2b$10$example_hash_here', 'Admin', 'User', 500, 'enterprise', TRUE)
ON CONFLICT (email) DO NOTHING;
