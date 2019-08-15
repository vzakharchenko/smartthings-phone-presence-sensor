const { sendData, sendDataWithResponse } = require('../restCalls');
const { encryptPassword } = require('./encrypt');
const { config, saveConfig } = require('../env.js');

const loginUrl = () => `${config.router.httpOrhttps}://${config.router.routerIp}:${config.router.routerPort}/cgi-bin/luci/;stok=/login?form=login`;

let tpLinkTokenStore = {
  time: 0,
};

const diff = 1000 * 60 * 5;

function checkToken() {
  return tpLinkTokenStore && (tpLinkTokenStore.time + diff) > new Date().getTime();
}

function getPublicKey() {
  return new Promise((resolve, reject) => {
    const url = loginUrl();
    sendData(
      `${url}`,
      'POST',
      'operation=read',
      { 'Content-Type': 'application/x-www-form-urlencoded' },
    )
      .then((res) => {
        const json = JSON.parse(res);
        if (json.success) {
          const { data } = json;
          resolve(data.password);
        } else {
          reject(json.errorcode);
        }
      }).catch((err) => {
        reject(err);
      });
  });
}

function checkTpLinkToken(token) {
  return !!token.stok;
}

function getEncryptedPassword() {
  return new Promise((resolve, reject) => {
    const { router } = config;
    const { encryptedPassword } = router;

    if (!encryptedPassword || router.password) {
      config.router.encryptedPassword = null;
      getPublicKey().then((publicKey) => {
        resolve(encryptPassword(router.password, publicKey[0], publicKey[1]));
      }).catch(reject);
    } else {
      resolve(encryptedPassword);
    }
  });
}

function loginTpLink() {
  return new Promise((resolve, reject) => {
    getEncryptedPassword().then((password) => {
      if (!checkToken()) {
        sendDataWithResponse(
          `${loginUrl()}`,
          'POST',
          `operation=login&username=${config.router.userName}&password=${password}`,
          { 'Content-Type': 'application/x-www-form-urlencoded' },
        )
          .then((res) => {
            const json = JSON.parse(res.body);
            if (json.success) {
              const { data } = json;
              const token = { stok: data.stok, header: res.headers['set-cookie'][0] };
              tpLinkTokenStore = { token, time: new Date().getTime() };
              if (!config.router.encryptedPassword) {
                config.router.encryptedPassword = password;
                config.router.password = '';
                saveConfig(config);
              }
              resolve(token);
            } else {
              reject(json.errorcode);
            }
          }).catch((err) => {
            reject(err);
          });
      } else {
        resolve(tpLinkTokenStore.token);
      }
    }).catch(reject);
  });
}

function getTpLinkComponents() {
  return [
    'tpLink',
    'devices',
    'users',
    'macs'];
}

module.exports.getTpLinkComponents = getTpLinkComponents;
module.exports.loginTpLink = loginTpLink;
module.exports.checkTpLinkToken = checkTpLinkToken;
