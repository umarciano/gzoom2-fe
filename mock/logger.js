'use strict';

var winston = require('winston'),
    fs = require('fs'),
    path = require('path'),
    logDir = path.join('.', 'logs'),
    logFile = path.join(logDir, 'mock-server.log'),
    logger = new winston.Logger({
      transports: [
        new winston.transports.File({
          level: 'info',
          filename: logFile,
          handleExceptions: true,
          json: true,
          maxsize: 5242880, //5MB
          maxFiles: 5,
          colorize: false
        }),
        new winston.transports.Console({
          level: 'debug',
          handleExceptions: true,
          json: false,
          colorize: true
        })
      ],
      exitOnError: false
    });

winston.emitErrs = true;

function mkdirSync(path) {
  try {
    fs.mkdirSync(path);
  } catch(e) {
    if ( e.code !== 'EEXIST' ) {
      throw e;
    }
  }
}

mkdirSync(logDir);

module.exports = logger;
module.exports.stream = {
  write: function(message) {
    logger.info(message);
  }
};
