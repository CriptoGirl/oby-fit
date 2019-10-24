-- query separator
DROP TABLE IF EXISTS xwf_obyfit_user_challenge;
-- query separator
DROP TABLE IF EXISTS xwf_obyfit_challenge_details
-- query separator
CREATE TABLE IF NOT EXISTS xwf_obyfit_user_challenge (
  wallet CHAR(32) NOT NULL,
  authorization_code CHAR(64) UNIQUE,
  refresh_token CHAR(64) UNIQUE,
  challenge_start TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  latest_day_nb INTEGER NOT NULL DEFAULT 0,
  latest_day_step_count INTEGER NOT NULL DEFAULT 0,
  total_step_count INTEGER NOT NULL DEFAULT 0,
  updated_on TIMESTAMP,
  updated_reason CHAR(13) NOT NULL DEFAULT 'New challenge',
  updated_source CHAR(13),
  PRIMARY KEY (wallet)
);
-- query separator
CREATE TABLE IF NOT EXISTS xwf_obyfit_challenge_details (
  wallet CHAR(32) NOT NULL,
  challenge_start TIMESTAMP NOT NULL,
  period INTEGER NOT NULL,
  steps INTEGER NOT NULL,
  period_start TIMESTAMP NOT NULL,
  period_end TIMESTAMP NOT NULL,
  updated_source CHAR(13),
  PRIMARY KEY (wallet, challenge_start, period)
);
