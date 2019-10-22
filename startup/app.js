const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');

// routes
const home = require('../routes/home');
// set-up pages
const sign_up = require('../routes/sign_up');
const admin = require('../routes/admin');
// info pages
const terms = require('../routes/terms');
const privacy = require('../routes/privacy');

app.set('../views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static('resources')); //This will allow express to access any file in that folder
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', home);
// set-up pages
app.use('/sign_up', sign_up);
app.use('/admin', admin);
// info pages
app.use('/terms', terms);
app.use('/privacy', privacy);

module.exports = app;
