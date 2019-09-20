// SET EXPRESS ENVIRONMENT
const express = require('express');
const app = express();
const logger = require('morgan');

// Use morgan logger for logging requests
app.use(logger('dev'));

// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Make public a static folder
app.use(express.static('public'));

const router = require('../routes/scraperoutes')

app.use(router)

console.log('Express Config Loaded...')

module.exports = app
