-- Add promo code columns to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS promo_code_applied BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS remaining_tests INTEGER DEFAULT 0;

-- Update existing users to have default values
UPDATE users 
SET promo_code_applied = FALSE, remaining_tests = 0 
WHERE promo_code_applied IS NULL OR remaining_tests IS NULL; 