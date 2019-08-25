const oui = require('oui');
const {
  getRouterInfo, getBlackList, activateBlockMac, logout,
} = require('./RouterAPI');
const logger = require('../logger');
const { loginTpLink } = require('./Auth');
const { sendStatus } = require('../smartthings.js');

const elemType = {
  amesh_isRe: '0',
  defaultType: '0',
  from: 'tpLink',
  mac: '',
  name: '',
  nickName: '',
  type: '0',
  vendor: '',
};

function getListOfAllUsers() {
  return new Promise((resolve, reject) => {
    loginTpLink().then((res) => {
      getRouterInfo(res).then((data) => {
        const responseObject = {
          availableMacs: [],
          maclist: [],
          blockedMacs: [],
        };
        const devicesWired = data.access_devices_wired;
        if (devicesWired) {
          devicesWired.forEach((wired) => {
            const mac = wired.macaddr.replace(/-/g, ':');
            responseObject.availableMacs.push(Object.assign({}, elemType, {
              mac,
              name: wired.hostname,
              vendor: oui(mac),
            }));
            responseObject.maclist.push(wired.macaddr);
          });
        }
        const accessDevicesWirelessHost = data.access_devices_wireless_host;
        if (accessDevicesWirelessHost) {
          accessDevicesWirelessHost.forEach((wifi) => {
            const mac = wifi.macaddr.replace(/-/g, ':');
            responseObject.availableMacs.push(Object.assign({}, elemType, {
              mac,
              name: wifi.hostname,
              vendor: oui(mac),
            }));
            responseObject.maclist.push(wifi.macaddr);
          });
        }
        activateBlockMac(res).then(() => {
          getBlackList(res).then((blockedMacs) => {
            responseObject.blockedMacs = blockedMacs;
            sendStatus(responseObject).then((smartthingResponse) => {
              logger.debug(`smartthings Response=${JSON.stringify(smartthingResponse)}`);
              logout(res).then(() => resolve(responseObject)).catch(reject);
            }).catch((e) => {
              logout(res).then(() => reject(e)).catch(() => reject(e));
            });
          }).catch((e) => {
            logout(res)
              .then(() => reject(e))
              .catch(() => reject(e));
          });
        }).catch((e) => {
          logout(res)
            .then(() => reject(e))
            .catch(() => reject(e));
        });
      }).catch((e) => {
        logout(res)
          .then(() => reject(e))
          .catch(() => reject(e));
      });
    }).catch(reject);
  });
}

module.exports.getListOfAllUsers = getListOfAllUsers;
