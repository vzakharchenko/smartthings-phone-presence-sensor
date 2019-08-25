const oui = require('oui');
const { loginMikrotik } = require('./Auth');
const logger = require('../logger');
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
        conn.write('/interface/bridge/host/print').then((availableMacs) => {
          const responseObject = {
            availableMacs: [],
            maclist: [],
            blockedMacs: [],
          };
          availableMacs.forEach((availableMac) => {
            const macElement = availableMac['mac-address'];
            responseObject.maclist.push(macElement);
          });
          data.forEach((wifi) => {
            const mac = wifi['active-mac-address'];
            if (mac) {
              const device = {
                mac,
                name: wifi['host-name'],
                vendor: oui(mac),
              };
              if (responseObject.maclist.includes(mac)) {
                responseObject.availableMacs.push(Object.assign({}, elemType, device));
              }
            }
          });
          sendStatus(responseObject).then((smartthingResponse) => {
            logger.debug(`smartthings Response=${JSON.stringify(smartthingResponse)}`);
            resolve(responseObject);
          }).catch((e) => {
            reject(e);
          });
          conn.close();
        }).catch((e) => {
          reject(e);
          conn.close();
        });
      }).catch((e) => {
        reject(e);
        conn.close();
      });
    }).catch(reject);
  });
}

module.exports.getRouteOSListOfAllUsers = getRouteOSListOfAllUsers;
