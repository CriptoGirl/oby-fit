const express = require('express');
const router = express.Router();
const db = require('ocore/db');
// Obyfit Config & modules
const config = require('../conf_game.js');
const aa_data = require('../aa_data.js');

function getUserData(res, message) {
  // get user data from db
  let error, result;
  db.query(`SELECT
    wallet, authorization_code, refresh_token, challenge_start,
    latest_day_nb, latest_day_step_count, total_step_count, updated_reason
    FROM xwf_obyfit_user_challenge`,
    userRows => {
      if (userRows.length === 0) error = 'No data found';
      else result = userRows;
    res.render('obyfit/admin_edit', { title: 'ObyFit Admin Edit page', error, result, message });
  });
}

router.get('/', (req, res) => {
  getUserData(res);
});

router.post('/', (req, res) => {
  if (req.body.form_action === 'edit') {
    let edit_form = true;
    let wallet = req.body.wallet;
    let error;
    db.query(`SELECT wallet, challenge_start, latest_day_nb, latest_day_step_count,
      total_step_count, updated_reason
      FROM xwf_obyfit_user_challenge WHERE wallet=?`, [wallet],
      rows => {
        if (rows.length === 0) error = 'No data found';
        else if (rows.length > 1) error = 'Duplicate rows found';
        else {
          let data = rows[0];
          let new_period = data.latest_day_nb + 1;
          res.render('obyfit/admin_edit', { title: 'ObyFit Admin Edit page',
            edit_form, data, new_period });
        }
    });
  }

  if (req.body.form_action === 'save') {
    let message;
    db.query(`SELECT wallet, total_step_count
      FROM xwf_obyfit_user_challenge WHERE wallet=?`, [req.body.wallet],
      rows => {
        if (rows.length === 0) message = 'No data found';
        else if (rows.length > 1) message = 'Duplicate rows found';
        if (rows.length === 1) {
          let row = rows[0];
          let total_step_count = row.total_step_count + Number(req.body.latest_day_step_count);
          let updated_reason;
          if (req.body.new_period === '7') updated_reason = 'Ended';
          else updated_reason = 'Running';

          db.query(`UPDATE xwf_obyfit_user_challenge SET
            latest_day_nb=?, latest_day_step_count=?, total_step_count=?, updated_reason=?
            WHERE wallet=?`,
            [req.body.new_period, req.body.latest_day_step_count, total_step_count,
            updated_reason, req.body.wallet ]);
          // send step count to AA
          //aa_data.sendSteps(req.body.wallet, req.body.latest_day_step_count,
          //  req.body.latest_day_nb, total_step_count);
          message='Data sucessfully updated and step count sent to AA.'
        }
      getUserData(res, message);
    });
  }
});

module.exports = router;
