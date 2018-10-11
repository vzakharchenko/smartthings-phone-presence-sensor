const { apiGateWayInit } = require('./smartthings.js');
const { getDeviceList } = require('./presenceMobile.js');
const { getWiFiMap } = require('./wifi.js');

function smartthingsInit() {
  return new Promise((resolve, reject) => {
    const initData = {
      users: getDeviceList(),
      guestWiFi: getWiFiMap(),
      initialization: new Date().getTime(),
    };
    apiGateWayInit(initData).then(res => resolve(res)).catch(e => reject(e));
  });
}


module.exports.smartthingsInit = smartthingsInit;
