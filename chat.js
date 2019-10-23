// Obyte imports (libraries)
const validationUtils = require('ocore/validation_utils');
const db = require('ocore/db');
const device = require('ocore/device.js');
// Game imports (modules)
const chatUtils = require('./chatUtils.js');
//const toPlay = require('./toPlay.js');

function chatting(from_address, text) {
  db.query(`SELECT wallet, google_id, updated_reason FROM xwf_obyfit_user_challenge
    WHERE device=?`, [from_address], userRows => {

      // ** NO user address is found in the db ** //
      if (userRows.length === 0) {
        // ** User entered valid address ** //
        if (validationUtils.isValidAddress(text)) chatUtils.saveUserAddress(from_address, text);
        // ** No valid address was provided ** //
        else device.sendMessageToDevice(from_address, 'text', "Please send me your address");
      }

      // ** User address is found in the db ** //
      else {
        let row = userRows[0];
        // ** User entered valid wallet address **//
        if (validationUtils.isValidAddress(text)) {
          if (row.wallet === text)
            device.sendMessageToDevice(from_address, 'text',
              "Thank you. We alredy have this address for you.");
          else
            device.sendMessageToDevice(from_address, 'text',
              "Hm, we have different wallet address for you in our records. " +
              "The address we have is " + row.wallet);
        }
        // check if we have google_id, if not ask for it.
        if (!row.google_id) {}

        // if we have both wallet id and google id, start challange
            //????
            //toPlay.stackGame(from_address, row.user_wallet);

      } // user address was found in the db
  });
}

exports.chatting = chatting;
