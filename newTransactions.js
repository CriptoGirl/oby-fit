// Obyte imports (libraries)
const db = require('ocore/db');
//const device = require('ocore/device.js');
// ObyFit imports (modules)
const config = require('./conf_game.js');

function newTransactions(arrUnits) {
  // for each new transaction unit
  for(let i=0; i<arrUnits.length; i++) {
    let unit = arrUnits[i];
    db.query(`SELECT 1 FROM unit_authors WHERE unit=? AND address=?`,
      [unit, config.aaAddress], outboundTxn => {
        //if (outboundTxn.length === 1) // outbound Transaction
        if (outboundTxn.length === 0) {  // inbound Transaction
          // ** Get the wallet address from the unit ** //
          let unitUserWallet = '';
          db.query("SELECT address, asset FROM outputs WHERE unit=?", [unit], rows => {
            rows.forEach(row => {
              if (row.asset === null) {  // assets are in bytes
                if (row.address !== config.aaAddress) unitUserWallet = row.address;
              }
            });
            // ** Update db with chalange start time ** //
            let current_date_time = new Date().getTime();
            current_date_time -= 7200000; // time zone diff: 2 hours back
            db.query(`UPDATE xwf_obyfit_user_challenge SET
              challenge_start=?, latest_day_nb=0, latest_day_step_count=0, total_step_count=0,
              updated_reason='Running',
              updated_source='Obyte'
              WHERE wallet=?`,
              [ current_date_time, unitUserWallet ]);
          });  // get wallet address from the unit
        } // inbound Transaction
    }); // db
  }  // for each new transaction unit
}

exports.newTransactions = newTransactions;
