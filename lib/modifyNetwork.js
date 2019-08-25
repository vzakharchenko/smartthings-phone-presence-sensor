const url = require('url');
const dateFormat = require('dateformat');
const logger = require('./logger');
const {
  getAsusToken,
  createGuestNetwork,
  getIfExistsGuestNetwork,
  getWiFiList,
  getIfExistsGuestNetworkToken,
} = require('./wifi.js');
const { sendWIFI } = require('./smartthings.js');

const createNetworkResponse = {
  status: 'Unavailable',
  guestNetwork: {},
  guestNetworkName: '',
  message: '',
};


function createTempPassword() {
  return dateFormat(new Date(), 'ddmmyyyy');
}

function getStatusGuestNetwork(wifiName, asusToken) {
  return new Promise((resolve, reject) => {
    getIfExistsGuestNetworkToken(wifiName, asusToken)
      .then((guestNetwork) => {
        const response = Object.assign({}, createNetworkResponse, {
          status: guestNetwork.bss_enabled === '1' ? 'Exists' : 'DoesNotExists',
          message: '',
          guestNetwork,
          guestNetworkName: wifiName,
        });
        resolve(response);
      }).catch((err) => {
        const response = Object.assign({}, createNetworkResponse, {
          status: 'Error',
          message: err,
          guestNetworkName: wifiName,
        });
        reject(response);
      });
  });
}

function getNetwork(req, res) {
  const q = url.parse(req.url, true).query;
  const { wifiName } = q;
  if (!wifiName) {
    res.end(JSON.stringify(Object.assign({}, createNetworkResponse, {
      status: 'Error',
      message: 'Wifi name is missing',
    })));
  } else {
    getIfExistsGuestNetwork(wifiName)
      .then((response) => {
        res.end(JSON.stringify(response));
      }).catch((response) => {
        res.end(JSON.stringify(response));
      });
  }
}

function getAllNetworkPromise(asusToken) {
  return new Promise((resolve, reject) => {
    const wifiPromises = [];
    Object.keys(getWiFiList()).forEach((wifiName) => {
      wifiPromises.push(getStatusGuestNetwork(wifiName, asusToken));
    });
    Promise.all(wifiPromises).then((responses) => {
      const guestNetworks = {};
      responses.forEach((response) => {
        guestNetworks[response.guestNetworkName] = response;
        logger.debug(`${response.guestNetworkName}.psk=${response.psk}`);
      });
      sendWIFI(guestNetworks)
        .then((sendWIFIResponse) => {
          resolve(guestNetworks, sendWIFIResponse);
        }).catch((e) => {
          reject(e);
        });
    }).catch((e) => {
      reject(e);
    });
  });
}

function modifyNetwork(req, res, enable) {
  const q = url.parse(req.url, true).query;
  const { wifiName } = q;
  const { ssid } = q;
  const guestNetworkTempl = {};
  if (ssid) {
    guestNetworkTempl.ssid = `SmartThings_${ssid.split(' ').join('_')}`;
  }
  logger.debug(`wifiName=${wifiName}`);
  logger.debug(`ssid=${guestNetworkTempl.ssid}`);
  if (!wifiName) {
    res.end(JSON.stringify(Object.assign({}, createNetworkResponse, {
      status: 'Error',
      message: 'Wifi name is missing',
    })));
  } else {
    const wifiPassword = createTempPassword();
    createGuestNetwork(wifiPassword, wifiName, enable, guestNetworkTempl)
      .then((guestNetwork, asusToken) => {
        getAllNetworkPromise(asusToken).then((guestNetworks) => {
          logger.debug(`guestNetworks=${JSON.stringify(guestNetworks)}`);
          res.end(JSON.stringify(guestNetworks));
        }).catch((e) => {
          res.end(JSON.stringify(Object.assign({}, createNetworkResponse, {
            status: 'Error',
            message: e,
            guestNetworkName: wifiName,
          })));
        });
      }).catch((err) => {
        const response = Object.assign({}, createNetworkResponse, {
          status: 'Error',
          message: err,
          guestNetworkName: wifiName,
        });
        res.end(JSON.stringify(response));
      });
  }
}


function deleteNetwork(req, res) {
  modifyNetwork(req, res, false);
}

function createNetwork(req, res) {
  modifyNetwork(req, res, true);
}

function getAllNetwork(req, res, respData) {
  if (!respData) {
    const ret = { status: 'NOT SUPPORTED YET' };
    res.end(JSON.stringify(ret));
  } else {
    getAsusToken()
      .then((asusToken) => {
        getAllNetworkPromise(asusToken).then((r) => {
          const ret = { status: 'OK' };
          if (respData) {
            ret.data = r;
          }
          res.end(JSON.stringify(ret));
        }).catch((e) => {
          res.end(JSON.stringify(Object.assign({}, createNetworkResponse, {
            status: 'Error',
            message: e,
          })));
        });
      }).catch((response) => {
        res.end(JSON.stringify(Object.assign({}, createNetworkResponse, {
          status: 'Error',
          message: response,
        })));
      });
  }
}

function getAllNetworkUI(req, res) {
  getAllNetwork(req, res, true);
}


module.exports.deleteNetwork = deleteNetwork;
module.exports.createNetwork = createNetwork;
module.exports.getNetwork = getNetwork;
module.exports.getAllNetwork = getAllNetwork;
module.exports.getAllNetworkUI = getAllNetworkUI;
