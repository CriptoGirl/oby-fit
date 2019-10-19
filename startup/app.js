const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');

// routes
const home = require('../routes/home');
// custody
const custodyPosting = require('../routes/custodyPosting');
const custodySearch = require('../routes/custodySearch');
// accounting
const terms = require('../routes/terms');
const accountSearch = require('../routes/accountSearch');

app.set('../views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static('resources')); //This will allow express to access any file in that folder
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', home);
// custody
app.use('/custodyPosting', custodyPosting);
app.use('/custodySearch', custodySearch);
// accounting
app.use('/terms', terms);
app.use('/accountSearch', accountSearch);

module.exports = app;
