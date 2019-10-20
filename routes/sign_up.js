const express = require('express');
const router = express.Router();
const db = require('ocore/db');

router.get('/', (req, res) => {
  //res.send('ObyFit Challenge Sign-up page');
  let user_data_form = true;
  res.render('obyfit/sign_up', { title: 'ObyFit Challenge Sign-up page', user_data_form });
});

router.post('/', (req, res) => {
  // check that wallet address is a valid address
  // check that we do not have this record already
  // ....
  // saving user data
  let error, result;
  let wallet = req.body.wallet;
  let email = req.body.email;
  let state = req.body.state;
  if (state === 'sign_up') {
    db.query(`INSERT ` + db.getIgnore() + ` INTO xwf_obyfit_user_challenge
      ( wallet, email ) VALUES (?,?)`, [ wallet, email ],
      function (response) {
        if (response.insertId && response.affectedRows) result = 'User data has been sucessfully saved';
        else error = 'Can not save user data';
        res.render('obyfit/sign_up', { title: 'User data is saved', error, result, wallet, email });
    });
  }
  if (state === 'authorise') {
    let authorise = state;
    res.render('obyfit/sign_up', { title: 'User data is saved', error, result, wallet, email, authorise });
  }

  //res.render('obyfit/sign_up', { title: 'User data is saved', error, result, wallet, email });

  // testing post router
  //res.send('Posted');
  //res.render('obyfit/sign_up', { title: 'User data is saved', error, result });
})

module.exports = router;
