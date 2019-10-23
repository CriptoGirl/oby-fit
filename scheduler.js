// Obyte imports (libraries)
const db = require('ocore/db');
// ObyFit imports (modules)
const config = require('./conf_game.js');
const google_data = require('./google_data.js');
//
function startScheduler() {
  let current_date = new Date().getTime();
  console.log('====== Scheduler started at: ' + current_date);
  t = setInterval(runJob, config.job_frequency);
}

function runJob() {
  console.error('TEST: running runJob function');
  // tick-tock
  // check if any chalange period ended and request steps data from Google
  db.query(`SELECT wallet, refresh_token, challenge_start, latest_day_nb, total_step_count
    FROM xwf_obyfit_user_challenge
    WHERE updated_reason='Running'`,
    rows => {
      rows.forEach(row => {
        console.error('TEST: inside runJob function. wallet : ' + row.wallet);
        // for each user currently doing a challage, check if period has ended
        let current_date_time = new Date().getTime();
        let period_start = row.challenge_start + (config.period * row.latest_day_nb);
        let period_end = period_start + config.period;
        if (current_date_time >= period_end) {
          console.error('TEST: inside runJob function. before calling Google for wallet : ' + row.wallet);
          google_data.getSteps(row.wallet, row.refresh_token, row.challenge_start,
            row.latest_day_nb, row.total_step_count);
        }
      });
  });
}

exports.startScheduler = startScheduler;
