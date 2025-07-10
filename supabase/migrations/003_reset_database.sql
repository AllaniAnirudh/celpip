-- Reset the database by deleting all records
DELETE FROM writing_attempts;
DELETE FROM users;

-- Reset the sequence for writing_attempts
ALTER SEQUENCE writing_attempts_id_seq RESTART WITH 1;

-- Add sample writing tasks (these will be used by the practice page)
-- Note: The practice page currently uses hardcoded prompts, but we can add these for future use

-- Sample email writing tasks
INSERT INTO writing_attempts (id, user_id, task_type, prompt, response, word_count, time_spent, score, created_at) VALUES
(
  gen_random_uuid(),
  NULL,
  'email',
  'You recently purchased a laptop from TechStore, but it has been experiencing technical issues since the first day. Write an email to the customer service department at TechStore.

Include the following information:
- Your name and order number (use any order number)
- Description of the problems you''re experiencing
- Request for a replacement or refund
- Your preferred resolution

Write 150-200 words.',
  'This is a sample response for demonstration purposes. It would contain the actual user''s email response.',
  180,
  1200,
  '{"overall": 8, "grammar": 8, "vocabulary": 8, "coherence": 8, "taskRelevance": 8, "feedback": "Sample feedback", "improvementTips": ["Sample tip 1", "Sample tip 2"]}',
  NOW() - INTERVAL '1 day'
),
(
  gen_random_uuid(),
  NULL,
  'survey',
  'A local business magazine is conducting a survey about work-life balance. Please respond to the following questions:

1. How many hours do you typically work per week?
2. What challenges do you face in maintaining a good work-life balance?
3. What strategies do you use to manage stress and maintain well-being?
4. How has your work-life balance changed over the past five years?
5. What advice would you give to someone struggling with work-life balance?

Provide detailed answers with specific examples and explanations. Write 150-200 words.',
  'This is a sample response for demonstration purposes. It would contain the actual user''s survey response.',
  175,
  1560,
  '{"overall": 7, "grammar": 7, "vocabulary": 8, "coherence": 7, "taskRelevance": 8, "feedback": "Sample feedback", "improvementTips": ["Sample tip 1", "Sample tip 2"]}',
  NOW() - INTERVAL '2 days'
);

-- Reset all users to have has_used_free_test = false
UPDATE users SET has_used_free_test = FALSE; 