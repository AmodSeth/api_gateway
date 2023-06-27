const express = require('express');
const routes = require('./routes');
const fileWatcher = require('./fileWatcher');

const app = express();

app.use('/', routes);

fileWatcher.startWatching();
fileWatcher.loadServices(); // Call the loadServices function

module.exports = app;
