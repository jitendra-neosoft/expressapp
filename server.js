'use strict';

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const config = require('./config/config');
const bodyParser = require('body-parser');
const compression = require('compression');
const helmet = require('helmet');
const fs = require('fs');
const path = require('path');
const morgan = require('morgan');
const cors = require("cors");

mongoose.Promise = global.Promise;
mongoose.connect(config.MONGO_URI);

app.set('env', config.NODE_ENV);
app.set('port', config.PORT);

app.use(cors());
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());
app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }));
app.use(bodyParser.json({ limit: '50mb' }));

// importing all modules
app.use(require('./modules/auth/authcontroller'));
app.use(require('./modules/user/usercontroller'));
app.use(require('./modules/social/google'));

app.use(function (req, res) {
  return res.status(404).send({ success: false, msg: 'API not found' })
});


app.listen(app.get('port'), function () {
  console.log(`Server is listening on http://localhost:${app.get('port')}`);
});


module.exports = app;