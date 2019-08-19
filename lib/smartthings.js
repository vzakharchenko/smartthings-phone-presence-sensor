const { sendData, sendDataWithResponse } = require('./restCalls.js');
const { config } = require('./env.js');

const apiGateWay = shard => `${shard}/api/smartapps/installations/`;
const apiGateWayStatus = () => '/Phone/status?access_token=';
const apiGateWayWIFI = () => '/WIFI/guests?access_token=';
const apiGateWayInitUrl = () => '/Router/init?access_token=';

function sendPromise(body, shard, appId, secret) {
  return new Promise((resolve, reject) => {
    const url = `${apiGateWay(shard)}${appId}${apiGateWayStatus()}${secret}`;
    sendData(
      url,
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

function sendStatus(body) {
  return new Promise((resolve, reject) => {
    const { smartthings } = config();
    const promises = [];
    Object.keys(smartthings).forEach((name) => {
      if (name) {
        const user = smartthings[name];
        promises.push(sendPromise(body, user.shard, user.appId, user.secret));
      }
    });
    Promise.all(promises).then((res) => {
      resolve(res);
    }).catch((response) => {
      reject(response);
    });
  });
}

function sendWIFI(body) {
  return new Promise((resolve, reject) => {
    sendData(
      `${apiGateWay()}${config().smartapp.appId}${apiGateWayWIFI()}${config().smartapp.accessToken}`,
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

function apiGateWayInit(body, userName, appId, secret, shard) {
  return new Promise((resolve, reject) => {
    const url = `${apiGateWay(shard)}${appId}${apiGateWayInitUrl()}${secret}`;
    sendDataWithResponse(
      url,
      'POST',
      JSON.stringify(body),
      {
        'Content-Type': 'application/json',
      },
      userName,
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
