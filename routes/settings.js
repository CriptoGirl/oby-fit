const express = require('express');
const router = express.Router();
const db = require('ocore/db');

router.get('/', (req, res) => {
  //res.send('ObyFit Challenge Set-up page');
  res.render('obyfit/setting', { title: 'ObyFit Challenge Set-up page' });
});

// router.get('/', (req, res) => {
//   // Search
//   let data = [];
//
//   db.query(`SELECT txn_id, custody_id, instrument_id, quantity FROM xbh_custody`,
//     custodyRows => {
//       custodyRows.forEach(custodyRow => {
//         let dataElement = {
//           txn_id: custodyRow.txn_id ,
//           custody_id: custodyRow.custody_id ,
//           instrument_id: custodyRow.instrument_id,
//           quantity: custodyRow.quantity
//         }
//         data.push(dataElement);
//       });
//     });  // db
//
//   res.render('custody/custodySearch', { title: 'Custody Search page', data });
// });

module.exports = router;
