const express = require('express');
const router = express.Router();
const db = require('ocore/db');

router.get('/', (req, res) => {
  //res.send('Custody Posting page');
  res.render('custody/custodyPosting', { title: 'Custody Posting page' });
});

router.post('/', (req, res) => {
  // preparing transaction data
  // saving custody posting
  db.query(`INSERT INTO xbh_custody
    ( custody_id, instrument_id, txn_code, position_tp, post_dt,
      value_dt, originating_txt, quantity, special_price_reason,
      price_cy, price, price_condition, local_cy,
      reporting_cy, dealing_cy, local_cy_value,
      reporting_cy_value, dealing_cy_value, narrative, override_cd
    )
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [ req.body.custody_id, req.body.instrument_id, req.body.txn_code, req.body.position_tp, req.body.post_dt,
      req.body.value_dt, req.body.originating_txt, req.body.quantity, req.body.special_price_reason,
      req.body.price_cy, req.body.price, req.body.price_condition, req.body.local_cy,
      req.body.reporting_cy, req.body.dealing_cy, req.body.local_cy_value,
      req.body.reporting_cy_value, req.body.dealing_cy_value, req.body.narrative, req.body.override_cd
    ]);
  // testing post router
  res.send('Posted');
})

module.exports = router;
