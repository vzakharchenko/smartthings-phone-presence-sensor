const url = require('url');
const {
  getSupportedClients, blockMac,
  getCurrentQOSInfo,
  blockedUserMacs,
} = require('./wifi.js');
const { config, selectRouterType } = require('./env.js');
const { getListOfAllUsers } = require('./tplink/TPLinkManager.js');
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
      const response = Object.assign({}, {
        status: 'Error',
        message: err,
      });
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
  const q = url.parse(req.url, true).query;
  const { macs } = q;
  const { inLimit } = q;
  const { outLimit } = q;
  const { status } = q;
  if (!macs) {
    res.end(JSON.stringify({
      status: 'Error',
      message: 'mac is missing',
    }));
  } else if (!inLimit) {
    res.end(JSON.stringify({
      status: 'Error',
      message: 'inLimit is missing',
    }));
  } else if (!outLimit) {
    res.end(JSON.stringify({
      status: 'Error',
      message: 'outLimit is missing',
    }));
  } else if (!status) {
    res.end(JSON.stringify({
      status: 'Error',
      message: 'status is missing',
    }));
  } else {
    blockMac(macs, inLimit, outLimit, status).then((response) => {
      res.end(JSON.stringify(response));
    }).catch((e) => {
      res.end(JSON.stringify({
        status: 'Error',
        message: e,
      }));
    });
  }
}

function getDevices() {
  return Object.assign({}, config().smartthings, {});
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
