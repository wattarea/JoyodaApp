-- Add role column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'user';

-- Create index on role for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Set selman.oniva@gmail.com as admin
UPDATE users 
SET role = 'admin' 
WHERE email = 'selman.oniva@gmail.com';

-- If the user doesn't exist, insert them as admin
INSERT INTO users (email, first_name, last_name, credits, subscription_plan, email_verified, role) 
VALUES ('selman.oniva@gmail.com', 'Selman', 'Oniva', 1000, 'enterprise', TRUE, 'admin')
ON CONFLICT (email) DO UPDATE SET role = 'admin';
