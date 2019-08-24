const oui = require('oui');
const { loginMikrotik } = require('./Auth');
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

function getRouteOSListOfAllUsers() {
  return new Promise((resolve, reject) => {
    loginMikrotik().then((conn) => {
      conn.write('/ip/dhcp-server/lease/print').then((data) => {
        const responseObject = {
          availableMacs: [],
          maclist: [],
          blockedMacs: [],
        };
        data.forEach((wifi) => {
          const mac = wifi['active-mac-address'];
          if (mac) {
            const device = {
              mac,
              name: wifi['host-name'],
              vendor: oui(mac),
            };
            responseObject.availableMacs.push(Object.assign({}, elemType, device));
            responseObject.maclist.push(device.mac);
          }
        });
        sendStatus(responseObject).then((smartthingResponse) => {
          console.log(`smartthings Response=${JSON.stringify(smartthingResponse)}`);
          resolve(responseObject);
        }).catch((e) => {
          reject(e);
        });
        conn.close();
      }).catch((e) => {
        reject(e);
        conn.close();
      });
    }).catch(reject);
  });
}

module.exports.getRouteOSListOfAllUsers = getRouteOSListOfAllUsers;
