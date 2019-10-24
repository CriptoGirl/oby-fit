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
          res.render('obyfit/admin_edit', { title: 'ObyFit Admin Edit page',
            edit_form, data });
        }
    });
  }

  if (req.body.form_action === 'save') {
    db.query(`UPDATE xwf_obyfit_user_challenge SET
      latest_day_nb=?, latest_day_step_count=?, total_step_count=?, updated_reason=?
      WHERE wallet=?`,
      [req.body.latest_day_nb, req.body.latest_day_step_count, req.body.total_step_count,
      req.body.updated_reason, req.body.wallet ]);
    getUserData(res);
  }

});

module.exports = router;
