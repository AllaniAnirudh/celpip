-- Add guest_id column to writing_attempts table
ALTER TABLE writing_attempts ADD COLUMN guest_id TEXT;

-- Create index for better query performance
CREATE INDEX idx_writing_attempts_guest_id ON writing_attempts(guest_id);

-- Update existing records to have a default guest_id for backward compatibility
-- This ensures existing guest attempts are still accessible
UPDATE writing_attempts 
SET guest_id = 'legacy_guest' 
WHERE user_id IS NULL AND guest_id IS NULL; 