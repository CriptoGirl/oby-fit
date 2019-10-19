const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  //res.send('Account Search page');
  res.render('accounting/accountSearch', { title: 'Account Search page' });
});

module.exports = router;
