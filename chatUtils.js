// Obyte imports (libraries)
const db = require('ocore/db');
const device = require('ocore/device.js');
// Game imports (modules)
//const toPlay = require('./toPlay.js');

function saveUserAddress(device, wallet) {
  db.query(`INSERT INTO xwf_obyfit_user_challenge (device, wallet)
    VALUES (?,?)`, [device, wallet]);
  device.sendMessageToDevice(device, 'text', 'Your address is saved');
  device.sendMessageToDevice(device, 'text', "Please send me your google id");
  //toPlay.stackGame(device_address, wallet_address);  // ask user to play
}

function saveUserGoogleId(wallet, device, google_id) {
  db.query(`UPDATE xwf_obyfit_user_challenge SET google_id=?
    WHERE wallet=? AND device=?`, [google_id, wallet, device]);
  //toPlay.stackGame(user_device, user_wallet);
}

// function updateUserStatus(newStatus, user_wallet, user_device) {
//   db.query(`UPDATE xwf_stack_game_user SET user_status=?
//     WHERE user_wallet=?`, [newStatus, user_wallet]);
//   if (newStatus === 'sleeping') notificationsSuspended(user_device);
//   if (newStatus === 'active') toPlay.stackGame(user_device, user_wallet);
// }

exports.saveUserAddress = saveUserAddress;
exports.saveUserGoogleId = saveUserGoogleId;
//exports.updateUserStatus = updateUserStatus;
