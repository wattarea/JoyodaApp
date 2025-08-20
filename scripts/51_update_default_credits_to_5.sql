-- Update default credits for new users from 50 to 5
ALTER TABLE users ALTER COLUMN credits SET DEFAULT 5;

-- Update any existing users who still have the old default values (optional)
-- Uncomment the line below if you want to update existing users with 50 credits to 5 credits
-- UPDATE users SET credits = 5 WHERE credits = 50 AND subscription_plan = 'free';
