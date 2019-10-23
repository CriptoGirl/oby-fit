/*jslint node: true */
'use strict';
// Obyte imports (libraries)
const constants = require('ocore/constants.js');
const conf = require('ocore/conf');
const eventBus = require('ocore/event_bus');
const headlessWallet = require('headless-obyte');
const device = require('ocore/device.js');
const walletGeneral = require('ocore/wallet_general');
// ObyFit imports (modules)
const config = require('./conf_game.js');
const scheduler = require('./scheduler.js');
const chatting = require('./chat.js');
const newTransactions = require('./newTransactions.js');

// headless wallet is ready Event
eventBus.once('headless_wallet_ready', () => {
	headlessWallet.setupChatEventHandlers();

	/* ****************** OBY FIT *********************** */
	const app = require('./startup/app');
	// !!!!!!!!!!!! Change for deployment !!!!!!!!!!!!!!!! //
	const server = app.listen(process.env.PORT || 8080, () => {
	  console.log(`Express is running on port ${server.address().port}`);
	});

	// add AA's address to the watched list of addresses
	walletGeneral.addWatchedAddress(config.aaAddress, function() {
    console.log('====== AA address: ' + config.aaAddress + ' is added to the list of watched addresses');
	});

	// user pairs his device with the bot
	eventBus.on('paired', (from_address, pairing_secret) => {
		device.sendMessageToDevice(from_address, 'text',
			"Welcome to ObyFit Bot! Please enter your wallet address.");
	});

	// user sends message to the bot
	eventBus.on('text', (from_address, text) => {
		text = text.trim();
		//chatting.chatting(from_address, text);
	});
});

// user pays to the AA
eventBus.on('new_my_transactions', (arrUnits) => {
	newTransactions.newTransactions(arrUnits);
});

scheduler.startScheduler();

process.on('unhandledRejection', up => { throw up; });
