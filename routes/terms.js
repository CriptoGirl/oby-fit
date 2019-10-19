const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('accounting/terms', { title: 'Terms of Service page' });
});

module.exports = router;
