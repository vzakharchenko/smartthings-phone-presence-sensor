const { saveConfig, config } = require('./env.js');

const { deviceInit } = require('./smartthingsConnection.js');
const { getSmartAppInfo } = require('./smartthings');

function removeUser(req, res) {
  const { username } = req.body;
  const curConfig = { ...config() };
  const { smartthings } = curConfig;
  if (!username) {
    res.end(JSON.stringify({ status: 'FAIL', message: ' User name is empty' }));
  } else
  if (!smartthings[username]) {
    res.end(JSON.stringify({ status: 'FAIL', message: ' User does not exist' }));
  } else {
    delete smartthings[username];
    saveConfig(curConfig);
    res.end(JSON.stringify({ status: 'OK' }));
  }
}

function checkShard(shards, currentShard, appId, secret, successCallback) {
  if (currentShard) {
    getSmartAppInfo(currentShard, appId, secret).then((res) => {
      const deviceJson = res;
      if (deviceJson && Object.keys(deviceJson).length > 0) {
        deviceJson[Object.keys(deviceJson)[0]].shard = currentShard;
        successCallback(deviceJson);
      } else {
        successCallback(null);
      }
    }).catch((e) => {
      console.error(e);
      const nextShard = shards.pop();
      checkShard(shards, nextShard, appId, secret, successCallback);
    });
  } else {
    successCallback(null);
  }
}

function addUser(req, res) {
  const { appId, secret } = req.body;
  const curConfig = { ...config() };
  const { smartthings, smartapp } = curConfig;

  const shards = JSON.parse(JSON.stringify(smartapp));
  const shard = shards.pop();
  checkShard(shards, shard, appId, secret, (resp) => {
    curConfig.smartthings = { ...smartthings, ...resp };
    saveConfig(curConfig);
    res.end(JSON.stringify({ status: 'OK' }));
  });
}

function getUsers(req, res) {
  if (!config().smartthings) {
    res.end(JSON.stringify({ status: 'FAIL', message: ' Wrong Configuration File' }));
  } else {
    res.end(JSON.stringify({ status: 'OK', data: config().smartthings }));
  }
}

function assignMacToUser(req, res) {
  const { username } = req.body;
  const { mac } = req.body;
  const curConfig = { ...config() };
  const { smartthings } = curConfig;
  const smartthing = smartthings[username];
  if (smartthing && !smartthing.mac) {
    smartthing.mac = [];
  }
  if (!username) {
    res.end(JSON.stringify({ status: 'FAIL', message: ' User name is empty' }));
  } else
  if (!mac) {
    res.end(JSON.stringify({ status: 'FAIL', message: ' mac is empty' }));
  } else
  if (!smartthing) {
    res.end(JSON.stringify({ status: 'FAIL', message: ' User does not exists' }));
  } else
  if (smartthing.mac.includes(mac)) {
    res.end(JSON.stringify({ status: 'FAIL', message: ' already contains mac ' }));
  } else {
    smartthing.mac.push(mac);
    deviceInit(username, smartthing.shard, smartthing.appId, smartthing.secret)
      .then(() => {
        saveConfig(curConfig);
        res.end(JSON.stringify({ status: 'OK' }));
      }).catch((e) => {
        res.end(JSON.stringify({ status: 'Fail', error: e }));
      });
  }
}

function assignShard(req, res) {
  const { username } = req.body;
  const { shard } = req.body;
  const curConfig = { ...config() };
  const { smartthings } = curConfig;
  if (!username) {
    res.end(JSON.stringify({ status: 'FAIL', message: ' User name is empty' }));
  } else {
    const smartthing = smartthings[username];
    if (!shard) {
      res.end(JSON.stringify({ status: 'FAIL', message: ' mac is empty' }));
    } else
    if (!smartthing) {
      res.end(JSON.stringify({ status: 'FAIL', message: ' User does not exists' }));
    } else {
      smartthing.shard = shard;
      deviceInit(username, shard, smartthing.appId, smartthing.secret)
        .then(() => {
          saveConfig(curConfig);
          res.end(JSON.stringify({ status: 'OK' }));
        }).catch((e) => {
          res.end(JSON.stringify({ status: 'Fail', error: e }));
        });
    }
  }
}

function removeMacToUser(req, res) {
  const { username } = req.body;
  const { mac } = req.body;
  const curConfig = { ...config() };
  const { smartthings } = curConfig;
  if (!smartthings[username].mac) {
    smartthings[username].mac = [];
  }
  if (!username) {
    res.end(JSON.stringify({ status: 'FAIL', message: ' User name is empty' }));
  } else
  if (!mac) {
    res.end(JSON.stringify({ status: 'FAIL', message: ' mac is empty' }));
  } else
  if (!smartthings[username]) {
    res.end(JSON.stringify({ status: 'FAIL', message: ' User does not exists' }));
  }
  if (!smartthings[username].mac.includes(mac)) {
    res.end(JSON.stringify({ status: 'FAIL', message: ' user does not contain mac ' }));
  } else {
    smartthings[username] = smartthings[username].mac.filter((userMac) => mac !== userMac);
    saveConfig(curConfig);
    res.end(JSON.stringify({ status: 'OK' }));
  }
}

module.exports.getUsers = getUsers;
module.exports.assignMacToUser = assignMacToUser;
module.exports.removeMacToUser = removeMacToUser;
module.exports.removeUser = removeUser;
module.exports.addUser = addUser;
module.exports.assignShard = assignShard;
