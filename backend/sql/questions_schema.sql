CREATE TABLE IF NOT EXISTS axes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  code VARCHAR(50) NOT NULL UNIQUE,
  description TEXT NULL,
  display_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS questions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  axis_id INT NOT NULL,
  question_code VARCHAR(20) NOT NULL UNIQUE,
  question_text TEXT NOT NULL,
  helper_text TEXT NULL,
  answer_type ENUM('single_select', 'multi_select', 'text_area') NOT NULL,
  is_mandatory BOOLEAN NOT NULL DEFAULT TRUE,
  is_scored BOOLEAN NOT NULL DEFAULT TRUE,
  scoring_strategy ENUM('none', 'single_option_score', 'multi_sum', 'multi_average', 'multi_max', 'manual') NOT NULL DEFAULT 'single_option_score',
  weight DECIMAL(8,6) NULL,
  display_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (axis_id) REFERENCES axes(id)
);

CREATE TABLE IF NOT EXISTS question_answer_options (
  id INT PRIMARY KEY AUTO_INCREMENT,
  question_id INT NOT NULL,
  option_label VARCHAR(255) NOT NULL,
  option_value VARCHAR(100) NOT NULL,
  option_code VARCHAR(100) NULL,
  score DECIMAL(8,4) NULL,
  maturity_level INT NULL,
  display_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS question_display_rules (
  id INT PRIMARY KEY AUTO_INCREMENT,
  question_id INT NOT NULL,
  expected_option_id INT NOT NULL,
  next_question_id INT NULL,
  transition_text TEXT NULL,
  display_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
  FOREIGN KEY (expected_option_id) REFERENCES question_answer_options(id) ON DELETE CASCADE,
  FOREIGN KEY (next_question_id) REFERENCES questions(id),
  UNIQUE KEY uq_question_option_transition (question_id, expected_option_id)
);
