const { sendData } = require('./restCalls.js');
const { config } = require('./env.js');

const apiGateWay = () => `${config.asus.smartThingsUrl}/api/smartapps/installations/`;
const apiGateWayStatus = () => '/Phone/status?access_token=';
const apiGateWayWIFI = () => '/WIFI/guests?access_token=';
const apiGateWayInitUrl = () => '/Router/init?access_token=';

function sendStatus(body) {
  return new Promise((resolve, reject) => {
    sendData(
      `${apiGateWay()}${config.smartapp.appId}${apiGateWayStatus()}${config.smartapp.accessToken}`,
      'POST',
      JSON.stringify(body),
      {
        'Content-Type': 'application/json',
      },
    ).then((res) => {
      resolve(res);
    }).catch((response) => {
      reject(response);
    });
  });
}

function sendWIFI(body) {
  return new Promise((resolve, reject) => {
    sendData(
      `${apiGateWay()}${config.smartapp.appId}${apiGateWayWIFI()}${config.smartapp.accessToken}`,
      'POST',
      JSON.stringify(body),
      {
        'Content-Type': 'application/json',
      },
    ).then((res) => {
      resolve(res);
    }).catch((response) => {
      reject(response);
    });
  });
}

function apiGateWayInit(body) {
  return new Promise((resolve, reject) => {
    sendData(
      `${apiGateWay()}${config.smartapp.appId}${apiGateWayInitUrl()}${config.smartapp.accessToken}`,
      'POST',
      JSON.stringify(body),
      {
        'Content-Type': 'application/json',
      },
    ).then((res) => {
      resolve(res);
    }).catch((res) => {
      reject(res);
    });
  });
}

module.exports.sendStatus = sendStatus;
module.exports.sendWIFI = sendWIFI;
module.exports.apiGateWayInit = apiGateWayInit;
