// Obyte imports (libraries)
const db = require('ocore/db');
// Scheduler
//var schedule = require('node-schedule');
// Config
const config = require('./conf_game.js');
// Google API libraries integration
const {google} = require('googleapis');
// google
const oauth2Client = new google.auth.OAuth2(
  config.obyfit_client_id,
  config.obyfit_client_secret,
  config.obyfit_redirect_url
);

function getSteps(wallet, refresh_token, challenge_start, latest_day_nb, total_step_count) {
  console.error('TEST: inside getSteps function. wallet : ' + wallet);
  let period_start = challenge_start + (config.period * latest_day_nb);
  let period_end = period_start + config.period;

  oauth2Client.setCredentials({
   refresh_token: refresh_token
  });
  console.error('TEST: inside getSteps. period start : ' + period_start);
  console.error('TEST: inside getSteps. period start : ' + period_end);

  var fitness = google.fitness({ version: 'v1', auth: oauth2Client});

  var google_res =
    fitness.users.dataset.aggregate({
      userId: "me",
      requestBody: {
        "aggregateBy": [{
          "dataTypeName": "com.google.step_count.delta",
          "dataSourceId": "derived:com.google.step_count.delta:com.google.android.gms:estimated_steps"
        }],
        "bucketByTime": { "durationMillis": 86400000 },
        "startTimeMillis": period_start,
        "endTimeMillis": period_end
      }
    });

  console.error('TEST: inside getSteps function. after calling google for : ' + wallet);

  return google_res.then(function(result) {
    console.error('TEST: google_res status : ' + result.status + 'wallet: ' + wallet);
    let status = result.status;
    if (status === 200) {
      let steps = 0;
      let buckets = result.data.bucket;
      for(let i=0; i<buckets.length; i++) {
        let bucket = buckets[i];
        let datasets = bucket.dataset;
        for(let x=0; x<datasets.length; x++) {
          let dataset = datasets[x];
          let points = dataset.point;
          for(let y=0; y<points.length; y++) {
            let point = points[y];
            let values = point.value;
            for(let z=0; z<values.length; z++) {
              let value = values[z];
              steps += value.intVal;
            } //z
          } //y
        } //x
      } //i
      // update db with steps
      latest_day_nb += 1;
      total_step_count += steps;
      let reason = 'Running';
      if (latest_day_nb === 7) reason = 'Ended';
      console.error('TEST: inside getSteps function. before db update for wallet : ' + wallet);
      db.query(`UPDATE xwf_obyfit_user_challenge SET
        latest_day_nb=?, latest_day_step_count=?,
        total_step_count=?, updated_reason=?,
        updated_source='Google Fit'
        WHERE wallet=?`,
        [ latest_day_nb, steps, total_step_count, reason, wallet ]
      );
      // send message to AA
      //
    } // if status ok
  });
}

exports.getSteps = getSteps;
