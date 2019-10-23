// Config setting for the game
"use strict";
exports.aaName = "Obyte Fit AA";
// Google Ids
exports.obyfit_client_id = '109013719177-cfsh1i1gla7nhq9pevcuj80t0h55ud0d.apps.googleusercontent.com';
exports.obyfit_client_secret = 'YpQYwKJIV3wx6flgfLu6uhIW';
exports.obyfit_redirect_url = 	'http://obyfit.whistlingfrogs.com:8080/sign_up';
let day = 86400000; // day in mili-seconds
let hour = day/24; // hour in mili-seconds
let minute = hour/60; // minute in mili-seconds
exports.job_frequency = 10000;
exports.period = minute*5; // 5 minutes in mili-seconds
//exports.period = hour/2; // 30 minutes in mili-seconds

//exports.minBidAmount = 1000000;  // 1,000,000 is about £0.2
//exports.gameDuration = 60000;
//exports.notificationFrequency = 10000;
//exports.commissionRate = 1;  // 1%

// local environment
//exports.botWallet = '4H2FOFBP7ST6BLYWHZ3GUV5PHY626AM4';
//exports.botPairingCode = 'A/R1S1zX9R9KzN34IA5PCUbYbRB5WEDLEdVaNo/0s/Xu@obyte.org/bb-test#StackGame';  // local

exports.aaAddress = "VA2RPMV55IEHSJMB2SBIQKLSAXVLT3FT"; // AA version 0.0.1 - 23 Oct 2019

// Hosting environment
exports.headlessWallet = 'WXJIHWMUYHRQRPP2MTRWC6PQHPFBO7HG';

//exports.botWallet = 'QUONK7CUHPTGLNTZ6JE57SDVSFVDBCMM';    // hosting account 0AZJH343DDSDBJMI3EU5IFTKEYDJUEARG
//exports.botPairingCode = 'AziMKfNVh+TNOpnFJ8qKh1DpywCyQWU20ALmX5zA5rAm@obyte.org/bb-test#StackGame';

// ***************** AA HISTORY ******************** //
//exports.aaAddress = "IOSRPEX2BXEV6KNFBJTCAA32MT7NDI5L"; // AA version 0.0.1 - 20 Oct 2019
