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
const mail = require('./utils/mail');

mongoose.Promise = global.Promise;
mongoose.connect(config.MONGO_URI);

app.set('env', config.NODE_ENV);
app.set('port', config.PORT);

app.use(cors());
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());
app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }));
app.use(bodyParser.json({limit: '50mb'}));

// importing all modules
app.use(require('./modules/auth/authcontroller'));
app.use(require('./modules/user/usercontroller'));
app.use(require('./modules/social/google'));

app.use(function(req, res) {
  return res.status(404).send({ success: false, msg: 'API not found' })
});

var sendEmail = function (counter) {

  let mailOptions = {
    from: `Node API 😡<jitendra.kumar@neosofttech.com>`,
    to: `jitendra.kumar@neosofttech.com`,
    subject: `API Crashed ✖`,
    html: `<pre><b>Hello Jitendra,
      API is crashing ${counter} times?</b></pre>`
  };
  mail.sendEmail(mailOptions);
}

if (config.CLUSTERING) {

  const cluster = require('cluster');
  const os = require('os');

  if (cluster.isMaster) {
    let crashCount = 0;
    const cpus = os.cpus().length;
    console.log(`Forking for ${cpus} CPUs`);
    for (let i = 0; i < cpus; i++) {
      cluster.fork();
    }

    cluster.on('exit', function (worker, code, signal) {
      if (code !== 0 && !worker.exitedAfterDisconnect) {
        console.log(`Worker ${worker.id} crashed. ` + 'Starting a new worker...');
        crashCount++;
        cluster.fork();

        if (crashCount === 5) {
          console.log('Crashed 5 times, I am sending an email');
          sendEmail(crashCount);
        }
      }
    });

  } else {
    startServer();
  }

} else {
  startServer();
}

function startServer() {
  app.listen(app.get('port'), function () {
    console.log(`Server is listening on http://localhost:${app.get('port')}`);
  });
}

module.exports = app;