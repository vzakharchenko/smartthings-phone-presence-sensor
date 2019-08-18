const { apiGateWayInit } = require('./smartthings.js');
const { getDeviceList } = require('./presenceMobile.js');
const { getWiFiMap } = require('./wifi.js');
const { config } = require('./env.js');

function smartthingsInit0(initData, username, appId, secret) {
  return new Promise((resolve, reject) => {
    apiGateWayInit(initData, username, appId, secret)
      .then(res => resolve(res)).catch(e => reject(e));
  });
}

function smartthingsInit() {
  return new Promise((resolve, reject) => {
    const initData = {
      users: getDeviceList(),
      guestWiFi: getWiFiMap(),
      initialization: new Date().getTime(),
    };
    const { smartthings } = config();
    const prpms = [];
    Object.keys(smartthings).forEach((name) => {
      if (name) {
        const user = smartthings[name];
        prpms.push(smartthingsInit0(initData, name, user.appId, user.secret));
      }
    });
    Promise.all(prpms).then((r) => {
      resolve(r);
    })
      .catch((e) => {
        reject(e);
      });
  });
}


module.exports.smartthingsInit = smartthingsInit;
