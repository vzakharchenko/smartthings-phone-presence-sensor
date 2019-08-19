const { apiGateWayInit } = require('./smartthings.js');
const { getDeviceList } = require('./presenceMobile.js');
const { getWiFiMap } = require('./wifi.js');
const { config } = require('./env.js');

function smartthingsInit0(initData, username, shard, appId, secret) {
  return new Promise((resolve, reject) => {
    apiGateWayInit(initData, username, appId, secret, shard)
      .then(res => resolve(res)).catch(e => reject(e));
  });
}

function getInitData() {
  return {
    users: getDeviceList(),
    guestWiFi: getWiFiMap(),
    initialization: new Date().getTime(),
  };
}

function smartthingsInit() {
  return new Promise((resolve, reject) => {
    const initData = getInitData();
    const { smartthings } = config();
    const prpms = [];
    Object.keys(smartthings).forEach((name) => {
      if (name) {
        const user = smartthings[name];
        prpms.push(smartthingsInit0(initData, name, user.shard, user.appId, user.secret));
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

function deviceInit(name, shard, appId, secret) {
  return new Promise((resolve, reject) => {
    const initData = getInitData();
    smartthingsInit0(initData, name, shard, appId, secret).then((r) => {
      resolve(r);
    })
      .catch((e) => {
        reject(e);
      });
  });
}


module.exports.smartthingsInit = smartthingsInit;
module.exports.deviceInit = deviceInit;
