const base64 = require('base-64');
const { sendData } = require('./restCalls.js');
const { config } = require('./env.js');
const { sendStatus } = require('./smartthings.js');

const wifiNames = {
  'Wifi 2.4G 1 socket': 'wl0.1',
  'Wifi 2.4G 2 socket': 'wl0.2',
  'Wifi 2.4G 3 socket': 'wl0.3',
  'Wifi 5G 1 socket': 'wl1.1',
  'Wifi 5G 2 socket': 'wl1.2',
  'Wifi 5G 3 socket': 'wl1.3',
};
const guestNetworkTemplate = config.asus.guestWifi.guestWifiDefaultTemplate;

const loginUrl = () => `${config.asus.httpOrhttps}://${config.asus.routerIp}:${config.asus.routerPort}/login.cgi`;

const applyAppUrl = () => `${config.asus.httpOrhttps}://${config.asus.routerIp}:${config.asus.routerPort}/applyapp.cgi`;
const applyAppGetUrl = () => `${config.asus.httpOrhttps}://${config.asus.routerIp}:${config.asus.routerPort}/appGet.cgi`;

function getAsusToken(userName, password) {
  return new Promise((resolve, reject) => {
    const basicToken = base64.encode(`${userName}:${password}`);
    console.debug(`basicToken=${basicToken}`);
    sendData(
      loginUrl(),
      'post',
      encodeURIComponent(`login_authorization=${basicToken}`),
      {
        Authorization: `Basic ${basicToken}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'asusrouter-Android-DUTUtil-1.0.0.155',
      },
    ).then((response) => {
      const asusToken = JSON.parse(response);
      resolve(asusToken);
    }).catch((response) => {
      reject(response);
    });
  });
}


function restartService(asusToken, serviceNames) {
  return new Promise((resolve, reject) => {
    const restartJson = { action_mode: 'apply', rc_service: serviceNames };
    sendData(
      applyAppGetUrl(), 'POST',
      encodeURIComponent(JSON.stringify(restartJson)),
      {
        cookie: `asus_token=${asusToken.asus_token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'asusrouter-Android-DUTUtil-1.0.0.155',
      },
    ).then((response) => {
      resolve(response);
    }).catch((e) => {
      reject(e);
    });
  });
}

function createGuestNetwork(wifiPassword, wifiName, enable, guestNetworkTempl) {
  return new Promise((resolve, reject) => {
    const wifiPrefix = wifiNames[wifiName];
    if (wifiPrefix) {
      const guestNetworkClone = Object.assign(
        {},
        guestNetworkTemplate, guestNetworkTempl || {},
        { wpa_psk: wifiPassword, bss_enabled: enable ? 1 : 0 },
      );
      const guestNetwork = {};
      guestNetwork[`${wifiPrefix}_bss_enabled`] = guestNetworkClone.bss_enabled;
      guestNetwork[`${wifiPrefix}_ssid`] = guestNetworkClone.ssid;
      guestNetwork[`${wifiPrefix}_auth_mode_x`] = guestNetworkClone.auth_mode_x;
      guestNetwork[`${wifiPrefix}_crypto`] = guestNetworkClone.crypto;
      guestNetwork[`${wifiPrefix}_key`] = guestNetworkClone.key;
      guestNetwork[`${wifiPrefix}_wpa_psk`] = guestNetworkClone.wpa_psk;
      guestNetwork[`${wifiPrefix}_lanaccess`] = guestNetworkClone.lanaccess;
      guestNetwork[`${wifiPrefix}_expire`] = guestNetworkClone.expire;
      guestNetwork[`${wifiPrefix}_expire_tmp`] = guestNetworkClone.expire_tmp;
      guestNetwork[`${wifiPrefix}_macmode`] = guestNetworkClone.macmode;
      guestNetwork[`${wifiPrefix}_mbss`] = guestNetworkClone.mbss;
      guestNetwork.wl_unit = guestNetworkClone.wl_unit;
      guestNetwork.wl_subunit = guestNetworkClone.wl_subunit;
      guestNetwork.action_mode = guestNetworkClone.action_mode;
      guestNetwork.rc_service = guestNetworkClone.rc_service;
      console.debug(`create guestNetwork=${JSON.stringify(guestNetwork)}`);
      getAsusToken(config.asus.userName, config.asus.password)
        .then((asusToken) => {
          sendData(
            applyAppUrl(),
            'POST',
            encodeURIComponent(JSON.stringify(guestNetwork)),
            {
              cookie: `asus_token=${asusToken.asus_token}`,
              'Content-Type': 'application/x-www-form-urlencoded',
              'User-Agent': 'asusrouter-Android-DUTUtil-1.0.0.155',
            },
          ).then((response) => {
            const res = JSON.parse(response);
            if (res.modify && res.modify > -1) {
              delete guestNetworkClone.wl_unit;
              delete guestNetworkClone.wl_subunit;
              delete guestNetworkClone.action_mode;
              resolve(guestNetworkClone, asusToken);
            } else {
              reject(res.error);
            }
          }).catch((response) => {
            reject(response);
          });
        }).catch((response) => {
          reject(response);
        });
    } else {
      console.log(`Wifi Network ${wifiName} does not support`);
      reject(`Wifi Network ${wifiName} does not support`);
    }
  });
}

function getIfExistsGuestNetworkToken(wifiName, asusToken) {
  return new Promise((resolve, reject) => {
    const wifiPrefix = wifiNames[wifiName];
    if (wifiPrefix) {
      const guestNetworkClone = Object.assign(
        {},
        guestNetworkTemplate,
        {},
      );
      delete guestNetworkClone.wl_unit;
      delete guestNetworkClone.wl_subunit;
      delete guestNetworkClone.action_mode;
      let hook = 'hook=';
      Object.keys(guestNetworkClone).forEach((key) => {
        hook += `nvram_get(${wifiPrefix}_${key});`;
      });
      sendData(
        applyAppGetUrl(),
        'POST',
        encodeURIComponent(hook),
        {
          cookie: `asus_token=${asusToken.asus_token}`,
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'asusrouter-Android-DUTUtil-1.0.0.155',
        },
      ).then((response) => {
        console.log(`Wifi Network ${wifiName} Response: ${response}`);
        const res = JSON.parse(response);
        const guestNetwork = {};
        Object.keys(res).forEach((key) => {
          const newKey = key.slice(wifiPrefix.length + 1);
          guestNetwork[newKey] = res[key];
        });
        resolve(guestNetwork);
      }).catch((response) => {
        reject(response);
      });
    } else {
      console.log(`Wifi Network ${wifiName} does not support`);
      reject(`Wifi Network ${wifiName} does not support`);
    }
  });
}

function getIfExistsGuestNetwork(wifiName) {
  return new Promise((resolve, reject) => {
    const wifiPrefix = wifiNames[wifiName];
    if (wifiPrefix) {
      getAsusToken(config.asus.userName, config.asus.password)
        .then((asusToken) => {
          getIfExistsGuestNetworkToken(wifiName, asusToken);
        }).catch((response) => {
          reject(response);
        });
    } else {
      console.log(`Wifi Network ${wifiName} does not support`);
      reject(`Wifi Network ${wifiName} does not support`);
    }
  });
}

function blockedUserMacs(quos) {
  const blockedMacs = [];
  if (quos.rules) {
    quos.rules.forEach((rule) => {
      if (rule.flag1 === '1') {
        blockedMacs.push(rule.mac);
      }
    });
  }
  return blockedMacs;
}

function getCurrentQos(asusToken) {
  return new Promise((resolve, reject) => {
    const hook = 'hook=nvram_get(qos_enable);nvram_get(qos_type);nvram_get(qos_obw);nvram_get(qos_ibw);nvram_get(bwdpi_app_rulelist);nvram_get(ctf_disable);nvram_get(ctf_fa_mode);nvram_get(qos_bw_rulelist)';
    sendData(
      applyAppGetUrl(), 'POST',
      encodeURIComponent(hook),
      {
        cookie: `asus_token=${asusToken.asus_token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'asusrouter-Android-DUTUtil-1.0.0.155',
      },
    ).then((response) => {
      const qos = JSON.parse(response);
      const rulelist = qos.qos_bw_rulelist;
      console.log(`rulelist = ${JSON.stringify(rulelist)} `);
      const rules = [];
      if (rulelist) {
        // eslint-disable-next-line no-useless-escape
        const split1 = rulelist.split('\&\#60');
        split1.forEach((rule) => {
          // eslint-disable-next-line no-useless-escape
          const r = rule.split('\&\#62');
          const flag2 = r[4];
          const flag1 = r[0];
          const mac = r[1];
          const download = r[2];
          const upload = r[3];
          const newRule = {
            flag1,
            mac,
            download,
            upload,
            flag2,
          };
          rules.push(newRule);
        });
      }
      resolve({ rules, qos_enable: qos.qos_enable, qos_type: qos.qos_type });
    }).catch((e) => {
      reject(e);
    });
  });
}


function getCurrentQOSToken(asusToken) {
  return new Promise((resolve, reject) => {
    getCurrentQos(asusToken).then(quos => resolve(quos)).catch(e => reject(e));
  });
}

function getCurrentQOSInfo() {
  return new Promise((resolve, reject) => {
    getAsusToken(config.asus.userName, config.asus.password)
      .then((asusToken) => {
        getCurrentQOSToken(asusToken).then(quos => resolve(quos)).catch(e => reject(e));
      }).catch((response) => {
        reject(response);
      });
  });
}

function getSupportedClients() {
  return new Promise((resolve, reject) => {
    const hook = 'hook=get_wclientlist()';
    getAsusToken(config.asus.userName, config.asus.password)
      .then((asusToken) => {
        sendData(
          applyAppGetUrl(),
          'POST',
          encodeURIComponent(hook),
          {
            cookie: `asus_token=${asusToken.asus_token}`,
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': 'asusrouter-Android-DUTUtil-1.0.0.155',
          },
        ).then((response) => {
          const res = JSON.parse(response);
          const wclientlist = res.get_wclientlist;

          const availableMacs = [];
          Object.keys(wclientlist).forEach((routerMac) => {
            const router = wclientlist[routerMac];
            Object.keys(router).forEach((wifiTypeName) => {
              const wifiType = router[wifiTypeName];
              wifiType.forEach((mac) => {
                availableMacs.push(mac);
              });
            });
          });

          const hookDatabase = 'hook=get_clientlist_from_json_database()';
          sendData(
            applyAppGetUrl(),
            'POST',
            encodeURIComponent(hookDatabase),
            {
              cookie: `asus_token=${asusToken.asus_token}`,
              'Content-Type': 'application/x-www-form-urlencoded',
              'User-Agent': 'asusrouter-Android-DUTUtil-1.0.0.155',
            },
          ).then((responseDatabase) => {
            const resDB = JSON.parse(responseDatabase);
            const clientList = resDB.get_clientlist_from_json_database;

            const availableMacInfo = [];
            availableMacs.forEach((mac) => {
              availableMacInfo.push(clientList[mac]);
            });

            getCurrentQOSInfo(asusToken).then((quos) => {
              const macs = blockedUserMacs(quos);
              const responseObject = {
                availableMacs: availableMacInfo,
                maclist: availableMacs,
                blockedMacs: macs,
              };
              sendStatus(responseObject).then((smartthingResponse) => {
                console.log(`smartthings Response=${JSON.stringify(smartthingResponse)}`);
                resolve(responseObject, asusToken);
              }).catch((e) => {
                reject(e);
              });
            }).catch((e) => {
              reject(e);
            });
          }).catch((e) => {
            reject(e);
          });
        }).catch((e) => {
          reject(e);
        });
      }).catch((e) => {
        reject(e);
      });
  });
}

function restartQos(asusToken) {
  return restartService(asusToken,"restart_firewall;restart_qos");
}



function blockMac(macs, inLimit, outLimit, status) {
  return new Promise((resolve, reject) => {
    getAsusToken(config.asus.userName, config.asus.password)
      .then((asusToken) => {
        getCurrentQos(asusToken).then((quos) => {
          const macAddress = macs.split(',');
          const quosCopy = Object.assign({}, quos, {});
          console.log(`quos = ${JSON.stringify(quos)} `);
          console.log(`macAddress = ${JSON.stringify(macAddress)} `);
          quosCopy.rules = [].concat(quosCopy.rules);
          macAddress.forEach((mac) => {
            console.log(`mac = ${mac} `);
            const find = quosCopy.rules.find(rule => rule.mac === mac);
            console.log(`find = ${find} `);
            if (!find) {
              quosCopy.rules.push({
                flag1: status,
                mac,
                download: inLimit,
                upload: outLimit,
                flag2: 1,
              });
              console.log(`added quosCopy.rules = ${quosCopy.rules} `);
            } else {
              find.flag1 = status;
              find.download = inLimit;
              find.upload = outLimit;
            }
          });
          const ruleList = quosCopy.rules;
          console.log(`ruleList = ${ruleList} `);

          const ruleArrayStrings = [];
          ruleList.forEach((rule) => {
            ruleArrayStrings.push(`${rule.flag1}>${rule.mac}>${rule.download}>${rule.upload}>${rule.flag2}`);
          });
          const ruleStrings = ruleArrayStrings.join('<');
          const queryJson = {
            qos_enable: '1',
            qos_type: '2',
            qos_bw_rulelist: ruleStrings,
            action_mode: 'apply',
            rc_service: 'restart_firewall;restart_qos',
          };
          sendData(
            applyAppUrl(), 'POST',
            encodeURIComponent(JSON.stringify(queryJson)),
            {
              cookie: `asus_token=${asusToken.asus_token}`,
              'Content-Type': 'application/x-www-form-urlencoded',
              'User-Agent': 'asusrouter-Android-DUTUtil-1.0.0.155',
            },
          ).then((ok) => {
            restartQos(asusToken).then(() => {
              console.log(`ok = ${ok} `);
              resolve(queryJson);
            }).catch(e => reject(e));
          }).catch(e => reject(e));
        }).catch((e) => {
          reject(e);
        });
      }).catch((response) => {
        reject(response);
      });
  });
}

function getWiFiList() {
  return Object.assign({}, wifiNames, {});
}

function getWiFiMap() {
  const wiFiMap = [];
  const wiFiList = getWiFiList();
  Object.keys(wiFiList).forEach((guestWifi) => {
    const w = wiFiList[guestWifi];
    wiFiMap.push({ name: guestWifi, id: w });
  });
  return wiFiMap;
}

module.exports.getAsusToken = getAsusToken;
module.exports.createGuestNetwork = createGuestNetwork;
module.exports.getIfExistsGuestNetwork = getIfExistsGuestNetwork;
module.exports.getIfExistsGuestNetworkToken = getIfExistsGuestNetworkToken;
module.exports.getSupportedClients = getSupportedClients;
module.exports.getWiFiList = getWiFiList;
module.exports.getWiFiMap = getWiFiMap;
module.exports.blockMac = blockMac;
module.exports.getCurrentQOSInfo = getCurrentQOSInfo;
module.exports.getCurrentQOSToken = getCurrentQOSToken;
module.exports.restartQos = restartQos;
module.exports.blockedUserMacs = blockedUserMacs;

