const request = require('request');
const { config } = require('./env.js');

request.debug = config.server.debug;

function sendData(url, method = 'POST', data, headers) {
  return new Promise((resolve, reject) => {
    const options = {
      url,
      method,
      body: data,
      headers,
    };

    request(url, options, (error, response, body) => {
      if (!error && response.statusCode >= 200 && response.statusCode < 300) {
        resolve(body, response);
      } else {
        reject(error || body);
      }
    });
  });
}

// module.exports.fetchData = fetchData;
module.exports.sendData = sendData;
