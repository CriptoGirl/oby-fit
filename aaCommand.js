// Obyte imports (libraries)
const network = require('ocore/network.js');
const composer = require('ocore/composer.js');
const objectHash = require('ocore/object_hash.js');
const device = require('ocore/device.js');
const headlessWallet = require('headless-obyte');
// Game imports (modules)
const config = require('./conf_game.js');

function updateSteps() {
  let dataFeed = {};
  dataFeed.wallet =
  dataFeed.steps = ;
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
      console.log('Error paying winnings for lottery id: ' + lotteryId);
      device.sendMessageToDevice('0OJPHFMUUXRQGZKE2SVXFWVVTKSNXD5EQ', 'text',
        'ADMIN: error sending data to AA: ' + err);
      return;
    }
    else if (unit) {
      // console.log('STOP Command sent from the Bot to the AA, unit: ' + unit);
      device.sendMessageToDevice('0OJPHFMUUXRQGZKE2SVXFWVVTKSNXD5EQ', 'text',
        'ADMIN: data sent to AA from bot, unit: ' + unit);
    }
  });
}

// AA check who sent the message, so only this bot (i.e. its headless wallet) can
// tell it to stop.

exports.updateSteps = updateSteps;
