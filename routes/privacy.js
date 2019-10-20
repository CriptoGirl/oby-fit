const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  //res.send('Privacy page');
  res.render('info/privacy', { title: 'Privacy page' });
});

module.exports = router;
