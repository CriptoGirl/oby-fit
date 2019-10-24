const express = require('express');
const router = express.Router();
const db = require('ocore/db');
// Config
const config = require('../conf_game.js');

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
    res.render('obyfit/admin_edit', { title: 'ObyFit Admin Edit page', error, result });
  });
}

router.get('/', (req, res) => {
  getUserData(res);
});

router.post('/', (req, res) => {
  getUserData(res);
});

module.exports = router;
