-- Create LLM cache tables for conversational assessment flow
CREATE TABLE IF NOT EXISTS question_transition_cache (
    id INT AUTO_INCREMENT PRIMARY KEY,
    from_question_id INT NOT NULL,
    to_question_id INT NOT NULL,
    assessment_id INT NULL,
    user_answer TEXT NULL,
    transition_text LONGTEXT NOT NULL,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_from_to (from_question_id, to_question_id),
    INDEX idx_generated_at (generated_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
