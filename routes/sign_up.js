const express = require('express');
const router = express.Router();
const db = require('ocore/db');
// Google API libraries
const {google} = require('googleapis');

router.get('/', (req, res) => {
  //res.send('ObyFit Challenge Sign-up page');
  let user_data_form = true;
  res.render('obyfit/sign_up', { title: 'ObyFit Challenge Sign-up page', user_data_form });
});

router.post('/', (req, res) => {
  //
  let error, result;
  let wallet = req.body.wallet;
  let email = req.body.email;
  let state = req.body.state;
  // saving user Data
  // check that wallet address is a valid address
  // check that we do not have this record already
  if (state === 'sign_up') {
    db.query(`INSERT ` + db.getIgnore() + ` INTO xwf_obyfit_user_challenge
      ( wallet, email ) VALUES (?,?)`, [ wallet, email ],
      function (response) {
        if (response.insertId && response.affectedRows) result = 'User data has been sucessfully saved';
        else error = 'Can not save user data';
        res.render('obyfit/sign_up', { title: 'User data is saved', error, result, wallet, email });
    });
  }

  // getting authorisation from Google for Google Fit API connection
  if (state === 'authorise') {
    let authorise = state;
    // google
    const obyfit_client_id = '109013719177-cfsh1i1gla7nhq9pevcuj80t0h55ud0d.apps.googleusercontent.com';
    const obyfit_client_secret = 'YpQYwKJIV3wx6flgfLu6uhIW';
    const obyfit_redirect_url = 	'http://obyfit.whistlingfrogs.com:3000/sign_up';
    const oauth2Client = new google.auth.OAuth2(
      obyfit_client_id,
      obyfit_client_secret,
      obyfit_redirect_url
    );
    // generate a url that asks permissions for Blogger and Google Calendar scopes
    const scopes = [
      'https://www.googleapis.com/auth/fitness.activity.read'
    ];
    const url = oauth2Client.generateAuthUrl({
      // 'online' (default) or 'offline' (gets refresh_token)
      access_type: 'offline',
      // If you only need one scope you can pass it as a string
      scope: scopes
    });

    res.redirect(url)
    //
    //res.render('obyfit/sign_up', { title: 'User data is saved', error, result, wallet, email, authorise });
  }

  //res.render('obyfit/sign_up', { title: 'User data is saved', error, result, wallet, email });

  // testing post router
  //res.send('Posted');
  //res.render('obyfit/sign_up', { title: 'User data is saved', error, result });
})

module.exports = router;
