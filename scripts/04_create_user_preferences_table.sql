-- Create user_preferences table for storing user notification and app preferences
CREATE TABLE IF NOT EXISTS user_preferences (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    email_notifications BOOLEAN DEFAULT TRUE,
    low_credit_warnings BOOLEAN DEFAULT TRUE,
    feature_updates BOOLEAN DEFAULT TRUE,
    marketing_emails BOOLEAN DEFAULT FALSE,
    processing_notifications BOOLEAN DEFAULT TRUE,
    theme VARCHAR(20) DEFAULT 'light' CHECK (theme IN ('light', 'dark', 'auto')),
    language VARCHAR(10) DEFAULT 'en',
    timezone VARCHAR(50) DEFAULT 'UTC',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);

-- Insert default preferences for existing users
INSERT INTO user_preferences (user_id, email_notifications, low_credit_warnings, feature_updates) 
VALUES 
    (1, TRUE, TRUE, TRUE),
    (2, TRUE, TRUE, FALSE),
    (3, FALSE, TRUE, TRUE)
ON CONFLICT (user_id) DO NOTHING;
