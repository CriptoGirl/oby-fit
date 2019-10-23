const express = require('express');
const router = express.Router();
const db = require('ocore/db');
const url = require('url');
// Google API libraries integration
const {google} = require('googleapis');
// Config
const config = require('../conf_game.js');
// google
const oauth2Client = new google.auth.OAuth2(
  config.obyfit_client_id,
  config.obyfit_client_secret,
  config.obyfit_redirect_url
);

async function refreshToken(google_authorization_code, res) {
  //Retrieve access token
  // This will provide an object with the access_token and refresh_token.
  const {tokens} = await oauth2Client.getToken(google_authorization_code)
  oauth2Client.setCredentials(tokens);
  let refresh_token = '';
  if (tokens) {
    if (tokens.refresh_token) {
      refresh_token = tokens.refresh_token;
      let step_2 = true;
      res.render('obyfit/sign_up', { title: 'ObyFit Challenge Sign-up page',
        google_authorization_code, refresh_token, step_2 });
    }
  }
}

router.get('/', (req, res) => {
  // check if the calling url contains response from Google
  var q = url.parse(req.url, true);
  var qdata = q.query; //returns an object: {code: '4/sQF_....' }
  if (qdata.code) {
    // Google Authorisation page returned authorisation code
    let google_authorization_code = qdata.code;
    refreshToken(google_authorization_code, res);
  }
  else if (qdata.error) {
    // Google Authorisation page returned an error
  }
  else {
    let step_1 = true;
    res.render('obyfit/sign_up', { title: 'ObyFit Challenge Sign-up page', step_1 });
  }
});

router.post('/', (req, res) => {
  //
  let error, result;
  let wallet = req.body.wallet;
  let google_authorization_code = req.body.google_authorization_code;
  let refresh_token = req.body.refresh_token;
  let form_action = req.body.form_action;
  // saving user Data
  // check that wallet address is a valid address
  // check that we do not have this record already
  if (form_action === 'save_user_data') {
    db.query(`INSERT ` + db.getIgnore() + ` INTO xwf_obyfit_user_challenge
      ( wallet, authorization_code, refresh_token ) VALUES (?,?,?)`,
      [ wallet, google_authorization_code, refresh_token ],
      function (response) {
        let step_3 = true;
        if (response.insertId && response.affectedRows) result = 'User data has been sucessfully saved';
        else error = 'Can not save user data';
        res.render('obyfit/sign_up', { title: 'User data is saved', error, result, wallet, step_3 });
    });
  }

  // getting authorisation from Google for Google Fit API connection
  if (form_action === 'authorise') {
    let authorise = form_action;
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
  }
})

module.exports = router;
