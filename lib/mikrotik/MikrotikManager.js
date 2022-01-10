const oui = require('oui');
const { loginMikrotik } = require('./Auth');
const logger = require('../logger');
const { sendStatus } = require('../smartthings');

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

async function getRouteOSListOfAllUsers() {
  const conn = await loginMikrotik();
  try {
    const data = await conn.write('/ip/dhcp-server/lease/print');
    const availableMacs = await conn.write('/interface/bridge/host/print');
    const wirelessMacs = await conn.write('/interface/wireless/registration-table/print');
    const responseObject = {
      availableMacs: [],
      maclist: [],
      blockedMacs: [],
    };
    availableMacs.forEach((availableMac) => {
      const macElement = availableMac['mac-address'];
      responseObject.maclist.push(macElement);
    });
    wirelessMacs.forEach((wirelessMac) => {
      const macElement = wirelessMac['mac-address'];
      const device = {
        mac: macElement,
        name: `${wirelessMac.interface}(${wirelessMac['last-ip']})`,
        vendor: oui(macElement),
      };
      responseObject.maclist.push(macElement);
      responseObject.availableMacs.push({ ...elemType, ...device });
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
          responseObject.availableMacs.push({ ...elemType, ...device });
        }
      }
    });
    try {
      await conn.close();
    } catch (e) {
      console.log(`warning connection does not closed.${e}`);
    }
    const smartthingResponse = await sendStatus(responseObject);
    logger.debug(`smartthings Response=${JSON.stringify(smartthingResponse)}`);
    return responseObject;
  } catch (e1) {
    try {
      await conn.close();
    } catch (e) {
      console.log(`warning connection does not closed.${e}`);
    }
    throw e1;
  }
}

module.exports.getRouteOSListOfAllUsers = getRouteOSListOfAllUsers;
