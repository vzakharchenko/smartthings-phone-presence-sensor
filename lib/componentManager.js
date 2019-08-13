
const { smartthingsInit } = require('./smartthingsConnection');
const { getAsusToken } = require('./wifi');
const { config } = require('./env.js');

function getListResponse(req, res, response) {
  res.end(JSON.stringify(response));
}

function getListSmartThings(req, res, routerStatus) {
  let routerMessage = 'Successfully connected';
  let status = 'OK';
  const components = [
    'asus',
    'smartapp',
    'serverConfig'];
  if (!routerStatus.error) {
    components.push(
      'devices',
      'users',
      'macs',
      'networks',
    );
  } else {
    components.push('routerError');
    status = 'FAIL';
    routerMessage = routerStatus.message;
  }
  smartthingsInit().then(() => {
    getListResponse(
      req, res,
      {
        status,
        routerMessage,
        smartThingMessage: 'Successfully connected',
        data: components,
      },
    );
  }).catch((e) => {
    components.push('smartThingError');
    getListResponse(
      req, res,
      {
        status: 'FAIL',
        routerMessage,
        smartThingMessage: e.toString(),
        data: components,
      },
    );
  });
}

function getListComponents(req, res) {
  getAsusToken(config.asus.userName, config.asus.password).then((token) => {
    getListSmartThings(
      req, res,
      token.asus_token
        ? { error: false }
        : { error: true, message: 'Please check router login/password' },
    );
  }).catch((e) => {
    getListSmartThings(req, res, { error: true, message: e.toString() });
  });
}

module.exports.getListComponents = getListComponents;
