-- query separator
DROP TABLE IF EXISTS xwf_obyfit_challenge_details
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
