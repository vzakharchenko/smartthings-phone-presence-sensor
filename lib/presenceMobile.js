const url = require('url');
const {
  getSupportedClients, blockMac,
  getCurrentQOSInfo,
} = require('./wifi.js');
const { config } = require('./env.js');


function blockedUserMacInternal(quos) {
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

function presenceMobiles(req, res) {
  getSupportedClients()
    .then((r, token) => {
      getCurrentQOSInfo(token).then((quos) => {
        const macs = blockedUserMacInternal(quos);
        res.end(JSON.stringify(Object.assign({}, r, { blockedMacs: macs })));
      }).catch((e) => {
        const response = Object.assign({}, {
          status: 'Error',
          message: e,
        });
        res.end(JSON.stringify(response));
      });
    }).catch((err) => {
      const response = Object.assign({}, {
        status: 'Error',
        message: err,
      });
      res.end(JSON.stringify(response));
    });
}


function blockedUserMac(req, res) {
  getCurrentQOSInfo().then((quos) => {
    res.end(JSON.stringify(blockedUserMacInternal(quos)));
  }).catch((e) => {
    res.end(JSON.stringify({
      status: 'Error',
      message: e,
    }));
  });
}
function blockUserMac(req, res) {
  const q = url.parse(req.url, true).query;
  const macs = q.macs;
  const inLimit = q.inLimit;
  const outLimit = q.outLimit;
  const status = q.status;
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
  return Object.assign({}, config.smartthings, {});
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
module.exports.deviceMetadata = deviceMetadata;
module.exports.getDeviceList = getDeviceList;
module.exports.blockUserMac = blockUserMac;
module.exports.blockedUserMac = blockedUserMac;