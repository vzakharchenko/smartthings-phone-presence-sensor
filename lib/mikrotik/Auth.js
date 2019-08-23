
const RosApi = require('node-routeros').RouterOSAPI;
const { config } = require('../env.js');

function getMikrotikComponents() {
  return [
    'mikrotik',
    'devices',
    'users',
    'macs'];
}

function loginMikrotik() {
  return new Promise((resolve, reject) => {
    const { router } = config();
    const conn = new RosApi({
      host: router.routerIp,
      port: router.routerPort,
      user: router.userName,
      password: router.password,
    });
    conn.connect()
      .then(() => {
        resolve(conn);
      })
      .catch(reject);
  });
}

function mikrotikCheckLogin() {
  return new Promise((resolve, reject) => {
    loginMikrotik().then((conn) => {
      const { connected } = conn;
      conn.close();
      resolve(connected);
    }).catch(reject);
  });
}

function checkMikrotikToken(connected) {
  return connected;
}

module.exports.getMikrotikComponents = getMikrotikComponents;
module.exports.loginMikrotik = loginMikrotik;
module.exports.mikrotikCheckLogin = mikrotikCheckLogin;
module.exports.checkMikrotikToken = checkMikrotikToken;
