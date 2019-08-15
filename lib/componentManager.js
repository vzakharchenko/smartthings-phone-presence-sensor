
const { smartthingsInit } = require('./smartthingsConnection');
const { getAsusToken, checkAsusToken, getAsusComponents } = require('./wifi');
const { loginTpLink, checkTpLinkToken, getTpLinkComponents } = require('./tplink/Auth');
const { selectRouterType } = require('./env.js');

function getListResponse(req, res, response) {
  res.end(JSON.stringify(response));
}

function getListSmartThings(req, res, routerStatus) {
  let routerMessage = 'Successfully connected';
  let status = 'OK';
  const components = [
    'smartapp',
    'serverConfig'];
  if (!routerStatus.error) {
    const routerComponents = selectRouterType(
      () => getAsusComponents(),
      () => getTpLinkComponents(),
    );
    routerComponents.forEach(((c) => {
      components.push(c);
    }));
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
function selectRouter() {
  return selectRouterType(() => getAsusToken(), () => loginTpLink());
}


function checkResponse(token) {
  return selectRouterType(
    () => checkAsusToken(token),
    () => checkTpLinkToken(token),
  );
}

function getListComponents(req, res) {
  selectRouter().then((token) => {
    getListSmartThings(
      req, res,
      checkResponse(token)
        ? { error: false }
        : { error: true, message: 'Please check router login/password' },
    );
  }).catch((e) => {
    getListSmartThings(req, res, { error: true, message: e.toString() });
  });
}

module.exports.getListComponents = getListComponents;
