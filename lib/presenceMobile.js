// const url = require('url');
const {
  getSupportedClients,
  asusBlockMac,
  getCurrentQOSInfo,
  blockedUserMacs,
} = require('./wifi');
const { config, selectRouterType } = require('./env');
const {
  getListOfAllUsers,
  tpLinkBlockUsers,
  tpLinkUnBlockUsers,
} = require('./tplink/TPLinkManager');
const { getRouteOSListOfAllUsers } = require('./mikrotik/MikrotikManager');

function presenceMobiles(req, res, state) {
  selectRouterType(
    () => getSupportedClients(),
    () => getListOfAllUsers(),
    () => getRouteOSListOfAllUsers(),
  )
    .then((r) => {
      const s = { status: 'OK' };
      if (state) {
        s.data = r;
      }
      res.end(JSON.stringify(s));
    }).catch((err) => {
      const response = {
        status: 'Error',
        message: err,
        stack: err.stack,
      };
      res.end(JSON.stringify(response));
    });
}

function presenceMobilesUI(req, res) {
  presenceMobiles(req, res, true);
}

function blockedUserMac(req, res) {
  getCurrentQOSInfo().then((quos) => {
    res.end(JSON.stringify(blockedUserMacs(quos)));
  }).catch((e) => {
    res.end(JSON.stringify({
      status: 'Error',
      message: e,
    }));
  });
}

function blockUserMac(req, res) {
  const { body } = req;
  selectRouterType(
    () => asusBlockMac(body.macs, 1, 1, 'test'), // todo
    () => tpLinkBlockUsers(body.macs),
    () => new Promise((resolve) => {
      resolve();
    }),
  ).then(() => {
    const s = { status: 'OK' };
    res.end(JSON.stringify(s));
  }).catch((e) => {
    res.end(JSON.stringify({
      status: 'Error',
      message: e,
    }));
  });
}

function unBlockUserMac(req, res) {
  const { body } = req;
  selectRouterType(
    () => asusBlockMac(body.macs, 1, 1, 'test'), // todo
    () => tpLinkUnBlockUsers(body.macs),
    () => new Promise((resolve) => {
      resolve();
    }),
  ).then(() => {
    const s = { status: 'OK' };
    res.end(JSON.stringify(s));
  }).catch((e) => {
    res.end(JSON.stringify({
      status: 'Error',
      message: e,
    }));
  });
}

function getDevices() {
  return { ...config().smartthings };
}

function getDeviceList() {
  const userList = [];
  const deviceList = getDevices();
  Object.keys(deviceList).forEach((user) => {
    const s = deviceList[user];
    userList.push({ user, mac: s.mac });
  });
  return userList;
}

function deviceMetadata(req, res) {
  res.end(JSON.stringify(getDevices()));
}

module.exports.presenceMobiles = presenceMobiles;
module.exports.presenceMobilesUI = presenceMobilesUI;
module.exports.deviceMetadata = deviceMetadata;
module.exports.getDeviceList = getDeviceList;
module.exports.blockUserMac = blockUserMac;
module.exports.blockedUserMac = blockedUserMac;
module.exports.unBlockUserMac = unBlockUserMac;
