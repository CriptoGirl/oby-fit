const express = require('express');
const router = express.Router();
const db = require('ocore/db');
const url = require('url');
// Google API libraries integration
const {google} = require('googleapis');
// google
const obyfit_client_id = '109013719177-cfsh1i1gla7nhq9pevcuj80t0h55ud0d.apps.googleusercontent.com';
const obyfit_client_secret = 'YpQYwKJIV3wx6flgfLu6uhIW';
const obyfit_redirect_url = 	'http://obyfit.whistlingfrogs.com:8080/sign_up';
const oauth2Client = new google.auth.OAuth2(
  obyfit_client_id,
  obyfit_client_secret,
  obyfit_redirect_url
);


router.get('/', (req, res) => {

  // Google integration
  // check if the calling url contains response from Google
  var q = url.parse(req.url, true);
  var qdata = q.query; //returns an object: {code: '4/sQF_....' }
  if (qdata.code) {
    // Google Authorisation page returned authorisation code, e.g.
    // code=4/sQF_IxMK5-GF-wBlOPNyJtzVg-kKg2lpFU1hCWBJ5lSC7tP1R9KdcYu_sYKFTqp5h-OuO_zBEXf83nSal7Y1psw&scope=https://www.googleapis.com/auth/fitness.activity.read
    let google_authorization_code = qdata.code;
    //Retrieve access token
    // This will provide an object with the access_token and refresh_token.
    //const {tokens} = await oauth2Client.getToken(google_authorization_code)
    const {tokens} = oauth2Client.getToken(google_authorization_code);
    oauth2Client.setCredentials(tokens);
    const refresh_token = tokens.refresh_token;
    res.send('refresh_token: '+ refresh_token);
    //res.render('obyfit/sign_up', { title: 'ObyFit Challenge Sign-up page', google_authorization_code, tokens });
  }
  else if (qdata.error) {
    // Google Authorisation page returned an error
  }
  else {
    //res.send('qdata code is false: '+qdata.code);
    let google_auth_request_pg = true;
    res.render('obyfit/sign_up', { title: 'ObyFit Challenge Sign-up page', google_auth_request_pg });
  }
});

router.post('/', (req, res) => {
  //
  let error, result;
  let wallet = req.body.wallet;
  let google_authorization_code = req.body.google_authorization_code;
  let form_action = req.body.form_action;
  // saving user Data
  // check that wallet address is a valid address
  // check that we do not have this record already
  if (form_action === 'save_user_data') {
    db.query(`INSERT ` + db.getIgnore() + ` INTO xwf_obyfit_user_challenge
      ( wallet, google_authorization_code ) VALUES (?,?)`,
      [ wallet, google_authorization_code ],
      function (response) {
        if (response.insertId && response.affectedRows) result = 'User data has been sucessfully saved';
        else error = 'Can not save user data';
        res.render('obyfit/sign_up', { title: 'User data is saved', error, result, wallet });
    });
  }

  // getting authorisation from Google for Google Fit API connection
  if (form_action === 'authorise') {
    let authorise = form_action;
    // // google
    // const obyfit_client_id = '109013719177-cfsh1i1gla7nhq9pevcuj80t0h55ud0d.apps.googleusercontent.com';
    // const obyfit_client_secret = 'YpQYwKJIV3wx6flgfLu6uhIW';
    // const obyfit_redirect_url = 	'http://obyfit.whistlingfrogs.com:3000/sign_up';
    // const oauth2Client = new google.auth.OAuth2(
    //   obyfit_client_id,
    //   obyfit_client_secret,
    //   obyfit_redirect_url
    // );
    // generate a url that asks permissions for Blogger and Google Calendar scopes
    const scopes = [
      'https://www.googleapis.com/auth/fitness.activity.read'
    ];
    const googleURL = oauth2Client.generateAuthUrl({
      // 'online' (default) or 'offline' (gets refresh_token)
      access_type: 'offline',
      // If you only need one scope you can pass it as a string
      scope: scopes
    });

    res.redirect(googleURL);
    //
    //res.render('obyfit/sign_up', { title: 'User data is saved', error, result, wallet, email, authorise });
  }

  //res.render('obyfit/sign_up', { title: 'User data is saved', error, result, wallet, email });

  // testing post router
  //res.send('Posted');
  //res.render('obyfit/sign_up', { title: 'User data is saved', error, result });
})

module.exports = router;
