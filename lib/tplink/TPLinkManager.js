const oui = require('oui');
const { getRouterInfo, getBlackList, activateBlockMac } = require('./RouterAPI');
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
            responseObject.availableMacs.push(Object.assign({}, elemType, {
              mac: wired.macaddr,
              name: wired.hostname,
              vendor: oui(wired.macaddr),
            }));
            responseObject.maclist.push(wired.macaddr);
          });
        }
        const accessDevicesWirelessHost = data.access_devices_wireless_host;
        accessDevicesWirelessHost.forEach((wifi) => {
          responseObject.availableMacs.push(Object.assign({}, elemType, {
            mac: wifi.macaddr,
            name: wifi.hostname,
          }));
          responseObject.maclist.push(wifi.macaddr);
        });
        activateBlockMac(res).then(() => {
          getBlackList(res).then((blockedMacs) => {
            responseObject.blockedMacs = blockedMacs;
            sendStatus(responseObject).then((smartthingResponse) => {
              console.log(`smartthings Response=${JSON.stringify(smartthingResponse)}`);
              resolve(responseObject);
            }).catch((e) => {
              reject(e);
            });
          }).catch(reject);
        }).catch(reject);
      }).catch(reject);
    }).catch(reject);
  });
}

module.exports.getListOfAllUsers = getListOfAllUsers;
