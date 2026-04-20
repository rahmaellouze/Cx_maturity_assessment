USE cx_maturity_framework;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS assessment_answer_selected_options;
DROP TABLE IF EXISTS assessment_answers;
DROP TABLE IF EXISTS assessment_axis_scores;
DROP TABLE IF EXISTS assessment_recommendations;
DROP TABLE IF EXISTS assessments;

SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE assessments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  company_name VARCHAR(255) NOT NULL,
  respondent_name VARCHAR(255) NULL,
  respondent_email VARCHAR(255) NULL,
  respondent_role_title VARCHAR(255) NULL,
  overall_score DECIMAL(8,4) NULL,
  maturity_level VARCHAR(100) NULL,
  overall_maturity_band VARCHAR(100) NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'in_progress',
  started_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);