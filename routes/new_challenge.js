const express = require('express');
const router = express.Router();
const db = require('ocore/db');

router.get('/', (req, res) => {
  let step_1 = true;
  res.render('obyfit/new_challenge', { title: 'ObyFit New Challenge page', step_1 });
});

router.post('/', (req, res) => {
  //
  let error, result;
  let wallet = req.body.wallet;
  // check if Wallet is found and user authorised access to Google Fit
  let step_2 = true;
  res.render('obyfit/new_challenge', { title: 'ObyFit New Challenge page', step_2 });
})

module.exports = router;
