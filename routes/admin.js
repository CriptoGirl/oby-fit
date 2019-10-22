const express = require('express');
const router = express.Router();
const db = require('ocore/db');
// Google API libraries integration
const {google} = require('googleapis');
// Config
const config = require('../conf_game.js');
// google
const oauth2Client = new google.auth.OAuth2(
  config.obyfit_client_id,
  config.obyfit_client_secret,
  config.obyfit_redirect_url
);

function getUserData(res) {
  // get user data from db
  let error, result;
  db.query(`SELECT
    wallet, authorization_code, refresh_token, challenge_start,
    latest_day_nb, latest_day_step_count, total_step_count, updated_reason
    FROM xwf_obyfit_user_challenge`,
    userRows => {
      if (userRows.length === 0) error = 'No data found';
      else result = userRows;
    res.render('obyfit/admin', { title: 'ObyFit Admin page', error, result });
  });
}

router.get('/', (req, res) => {
  //res.send('ObyFit Admin page');
  getUserData(res);
});

router.post('/', (req, res) => {
  db.query(`SELECT refresh_token FROM xwf_obyfit_user_challenge`, rows => {
    rows.forEach(row => {
      oauth2Client.setCredentials({
        refresh_token: row.refresh_token
      });
      var fitness = google.fitness({ version: 'v1', auth: oauth2Client});
      fitness.users.dataset.aggregate({
        userId: "me",
        requestBody: {
          "aggregateBy": [{
            "dataTypeName": "com.google.step_count.delta",
            "dataSourceId": "derived:com.google.step_count.delta:com.google.android.gms:estimated_steps"
          }],
          "bucketByTime": { "durationMillis": 86400000 },
          "startTimeMillis": 1438705622000,
          "endTimeMillis": 1439310422000
        }
      });
    });
  });
  getUserData(res);
});

module.exports = router;