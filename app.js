const express = require('express');
const morgan = require('morgan');
const routes = require('./routes');
const fileWatcher = require('./fileWatcher');
const bodyParser = require('body-parser');
const multer = require('multer');
const helmet = require("helmet")

const app = express();
// Create a multer instance to handle form-data requests
const upload = multer();

// Middleware for security purposes
app.use(helmet());

// Middleware to parse JSON body
app.use(bodyParser.json());
// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));
// Add the multer middleware to the express app
app.use(upload.any());

app.use(morgan(':method :url STATUS=:status RESPONSE_TIME=:response-time ms'));
app.use('/', routes);
app.use((err, req, res, next) => {
    console.log("uncaughtException: ", err);
  });
fileWatcher.startWatching();
fileWatcher.loadYAML(); // Call the loadYAML function

module.exports = app;
