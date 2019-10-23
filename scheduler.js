// Obyte imports (libraries)
const db = require('ocore/db');
// ObyFit imports (modules)
const config = require('./conf_game.js');
const google_data = require('./google_data.js');
//
function startScheduler() {
  t = setInterval(runJob, config.job_frequency);
}

function startScheduler() {
  // tick-tock
  // check if any chalange period ended and request steps data from Google
  db.query(`SELECT wallet, refresh_token, challenge_start, latest_day_nb, total_step_count
    FROM xwf_obyfit_user_challenge
    WHERE updated_reason='Running'`,
    rows => {
      rows.forEach(row => {
        // for each user currently doing a challage, check if period has ended
        let current_date_time = new Date().getTime();
        let period_start = challenge_start + (config.period * latest_day_nb);
        let period_end = period_start + config.period;
        if (current_date_time >= period_end) {
          google_data.getSteps(wallet, refresh_token, challenge_start, latest_day_nb,
            total_step_count);
        }
      });
  });
}

exports.startScheduler = startScheduler;