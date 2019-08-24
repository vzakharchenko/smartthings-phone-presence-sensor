const oui = require('oui');
const { loginMikrotik } = require('./Auth');

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
          const device = {
            mac: wifi['active-mac-address'],
            name: wifi['host-name'],
            vendor: oui(wifi['active-mac-address']),
          };
          responseObject.availableMacs.push(Object.assign({}, elemType, device));
          responseObject.maclist.push(device.mac);
          conn.close();
        });
        resolve(responseObject);
      }).catch((e) => {
        conn.close();
        reject(e);
      });
    }).catch(reject);
  });
}

module.exports.getRouteOSListOfAllUsers = getRouteOSListOfAllUsers;
