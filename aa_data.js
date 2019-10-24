// Obyte imports (libraries)
const network = require('ocore/network.js');
const composer = require('ocore/composer.js');
const objectHash = require('ocore/object_hash.js');
//const device = require('ocore/device.js');
const headlessWallet = require('headless-obyte');
// Game imports (modules)
const config = require('./conf_game.js');

function sendSteps(wallet, steps, day_nb, total_steps) {
  let dataFeed = {};
  dataFeed.user_wallet = wallet;
  dataFeed.user_steps = steps;
  dataFeed.day_nb = day_nb;
  dataFeed.user_total_steps = total_steps;
  var opts = {
    paying_addresses: [config.headlessWallet],
    change_address: config.headlessWallet,
    messages: [
        {
            app: "data_feed",
            payload_location: "inline",
            payload_hash: objectHash.getBase64Hash(dataFeed),
            payload: dataFeed
        }
    ],
    to_address: config.aaAddress,
    amount: 10000
  };
  headlessWallet.sendMultiPayment(opts, (err, unit) => {
    if (err){
      console.error('Error sending data to AA: ' + err);
      return;
    }
    else if (unit) console.error('Data message sent to the AA, unit: ' + unit);
  });
}

// AA check who sent the message, so only this bot (i.e. its headless wallet) can
// tell it to stop.

exports.sendSteps = sendSteps;
