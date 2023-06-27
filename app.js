const express = require('express');
const morgan = require('morgan');
const routes = require('./routes');
const fileWatcher = require('./fileWatcher');

const app = express();

app.use(morgan(':method :url STATUS=:status RESPONSE_TIME=:response-time ms'));
app.use('/', routes);

fileWatcher.startWatching();
fileWatcher.loadServices(); // Call the loadServices function

module.exports = app;
