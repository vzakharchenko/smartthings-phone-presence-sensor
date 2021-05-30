const request = require('request');
const { config } = require('./env');

request.debug = config().server.debug;

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

function sendDataWithResponse(url, method = 'POST', data, headers, responseData) {
  return new Promise((resolve, reject) => {
    const options = {
      url,
      method,
      body: data,
      headers,
    };

    request(url, options, (error, response, body) => {
      if (!error && response.statusCode >= 200 && response.statusCode < 300) {
        resolve({
          body, headers: response.headers, response, responseData,
        });
      } else {
        const message = error || body;
        reject({ message, response, responseData });
      }
    });
  });
}

// module.exports.fetchData = fetchData;
module.exports.sendData = sendData;
module.exports.sendDataWithResponse = sendDataWithResponse;
