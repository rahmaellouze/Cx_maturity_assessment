ALTER TABLE assessments
  DROP COLUMN IF EXISTS sector_id;

CREATE TABLE IF NOT EXISTS assessment_answers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  assessment_id INT NOT NULL,
  question_id INT NOT NULL,
  selected_option_id INT NULL,
  answer_text TEXT NULL,
  numeric_score DECIMAL(8,4) NULL,
  answered_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_assessment_question_answer (assessment_id, question_id),
  KEY idx_assessment_answers_assessment (assessment_id),
  KEY idx_assessment_answers_question (question_id),
  KEY idx_assessment_answers_option (selected_option_id)
);

CREATE TABLE IF NOT EXISTS assessment_answer_selected_options (
  id INT PRIMARY KEY AUTO_INCREMENT,
  assessment_answer_id INT NOT NULL,
  question_option_id INT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_assessment_answer_selected_option (assessment_answer_id, question_option_id),
  KEY idx_assessment_answer_selected_option_answer (assessment_answer_id),
  KEY idx_assessment_answer_selected_option_option (question_option_id)
);

CREATE TABLE IF NOT EXISTS assessment_axis_scores (
  id INT PRIMARY KEY AUTO_INCREMENT,
  assessment_id INT NOT NULL,
  axis_id INT NOT NULL,
  raw_score DECIMAL(8,4) NULL,
  max_score DECIMAL(8,4) NULL,
  score_percent DECIMAL(8,4) NULL,
  maturity_band VARCHAR(50) NULL,
  calculation_details TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_assessment_axis_score (assessment_id, axis_id),
  KEY idx_assessment_axis_scores_assessment (assessment_id),
  KEY idx_assessment_axis_scores_axis (axis_id)
);

CREATE TABLE IF NOT EXISTS assessment_recommendations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  assessment_id INT NOT NULL,
  axis_id INT NOT NULL,
  question_id INT NULL,
  recommendation_type VARCHAR(100) NOT NULL DEFAULT 'axis_summary',
  recommendation_title VARCHAR(255) NOT NULL,
  recommendation_text TEXT NOT NULL,
  priority_level VARCHAR(50) NOT NULL,
  source_theme_type VARCHAR(50) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_assessment_recommendations_assessment (assessment_id),
  KEY idx_assessment_recommendations_axis (axis_id),
  KEY idx_assessment_recommendations_priority (priority_level)
);
