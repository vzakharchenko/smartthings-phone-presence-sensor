const { deviceInit } = require('./smartthingsConnection.js');

const { config, saveConfig } = require('./env.js');


function checkShard(shards, currentShard, name, appId, secret, successCallback) {
  if (currentShard) {
    deviceInit(name, currentShard, appId, secret)
      .then(() => successCallback(currentShard)).catch(() => {
        const nextShard = shards.pop();
        checkShard(shards, nextShard, name, appId, secret, successCallback);
      });
  } else {
    successCallback(null);
  }
}

function saveSmartThingDeviceInfo(req, res) {
  const { body } = req;
  const curConfig = Object.assign({}, config(), {});
  const { smartthings, smartapp } = curConfig;
  const { appId } = body;
  const { secret } = body;
  smartthings[body.name] = Object.assign(smartthings[body.name]
    ? smartthings[body.name]
    : {}, {
    appId,
    secret,
    label: body.label,
  }, {});
  const shards = JSON.parse(JSON.stringify(smartapp));
  const shard = shards.pop();
  checkShard(shards, shard, body.name, appId, secret, (resp) => {
    smartthings[body.name].shard = resp;
    saveConfig(curConfig);
    res.end(JSON.stringify({ status: 'OK' }));
  });
}


module.exports.saveSmartThingDeviceInfo = saveSmartThingDeviceInfo;
