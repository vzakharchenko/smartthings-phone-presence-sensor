const { config } = require('./env.js');

function f(operation, message, optionalParams) {
  const c = config();
  if (c.server.debug) {
    console[operation](message, optionalParams);
  }
}

function log(message, optionalParams) {
  f('log', message, optionalParams);
}

function error(message, optionalParams) {
  console.error(message, optionalParams);
}

function debug(message, optionalParams) {
  f('error', message, optionalParams);
}

function info(message, optionalParams) {
  console.info(message, optionalParams);
}


module.exports.log = log;
module.exports.error = error;
module.exports.debug = debug;
module.exports.info = info;
