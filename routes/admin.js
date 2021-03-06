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

async function getSteps(res, refresh_token) {
  oauth2Client.setCredentials({
    refresh_token: refresh_token
  });
  var fitness = google.fitness({ version: 'v1', auth: oauth2Client});
  var google_res = await fitness.users.dataset.aggregate({
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
  if (google_res) {
    //var google_res_obj = JSON.parse(google_res);
    res.send('Test has some data' + google_res);
  }
}

router.post('/', (req, res) => {
  db.query(`SELECT refresh_token FROM xwf_obyfit_user_challenge`, rows => {
    rows.forEach(row => {
      //getSteps(res, row.refresh_token);
      let current_date_time = new Date().getTime();
      // "startTimeMillis": 1438705622000,
      // "endTimeMillis": 1439310422000
      oauth2Client.setCredentials({
       refresh_token: row.refresh_token
      });
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
            "startTimeMillis": current_date_time - 86400000,
            "endTimeMillis": current_date_time
          }
        });
      //return google_res.then(function(result) { res.send(result) });
      return google_res.then(function(result) {
        let status = result.status;
        if (status === 200) {
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
                  res.send(value.intVal.toString());
                }
                //res.send(point.value);
              }
              //res.send(dataset.point);
            }
            //res.send(bucket.dataset);
          }
          //res.send(result.data.bucket);
        }
        //res.send(result);
      });

      // if (google_res) {
      //   //var google_res_obj = JSON.parse(google_res);
      //   res.send('Test has some data' + google_res);
      // }
    });
  });
  //getUserData(res);
});

module.exports = router;
