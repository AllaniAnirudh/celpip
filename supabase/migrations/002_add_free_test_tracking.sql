-- Add has_used_free_test field to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS has_used_free_test BOOLEAN DEFAULT FALSE;

-- Update existing users to have has_used_free_test = false
UPDATE users SET has_used_free_test = FALSE WHERE has_used_free_test IS NULL; 