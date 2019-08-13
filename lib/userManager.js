const { saveConfig, config } = require('./env.js');

function addUser(req, res) {
  const { username } = req.body;
  const curConfig = Object.assign({}, config);
  const { smartthings } = curConfig;
  if (!username) {
    res.end(JSON.stringify({ status: 'FAIL', message: ' User name is empty' }));
  } else
  if (smartthings[username]) {
    res.end(JSON.stringify({ status: 'FAIL', message: ' User already exists' }));
  } else {
    smartthings[username] = { mac: [] };
    saveConfig(curConfig);
    res.end(JSON.stringify({ status: 'OK' }));
  }
}

function removeUser(req, res) {
  const { username } = req.body;
  const curConfig = Object.assign({}, config);
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

function getUsers(req, res) {
  if (!config.smartthings) {
    res.end(JSON.stringify({ status: 'FAIL', message: ' Wrong Configuration File' }));
  } else {
    res.end(JSON.stringify({ status: 'OK', data: config.smartthings }));
  }
}

function assignMacToUser(req, res) {
  const { username } = req.body;
  const { mac } = req.body;
  const curConfig = Object.assign({}, config);
  const { smartthings } = curConfig;
  if (!username) {
    res.end(JSON.stringify({ status: 'FAIL', message: ' User name is empty' }));
  } else
  if (!mac) {
    res.end(JSON.stringify({ status: 'FAIL', message: ' mac is empty' }));
  } else
  if (!smartthings[username]) {
    res.end(JSON.stringify({ status: 'FAIL', message: ' User does not exists' }));
  } else
  if (smartthings[username].includes(mac)) {
    res.end(JSON.stringify({ status: 'FAIL', message: ' already contains mac ' }));
  } else {
    smartthings[username].mac.push(mac);
    saveConfig(curConfig);
    res.end(JSON.stringify({ status: 'OK' }));
  }
}

function removeMacToUser(req, res) {
  const { username } = req.body;
  const { mac } = req.body;
  const curConfig = Object.assign({}, config);
  const { smartthings } = curConfig;
  if (!username) {
    res.end(JSON.stringify({ status: 'FAIL', message: ' User name is empty' }));
  } else
  if (!mac) {
    res.end(JSON.stringify({ status: 'FAIL', message: ' mac is empty' }));
  } else
  if (!smartthings[username]) {
    res.end(JSON.stringify({ status: 'FAIL', message: ' User does not exists' }));
  }
  if (!smartthings[username].includes(mac)) {
    res.end(JSON.stringify({ status: 'FAIL', message: ' user does not contain mac ' }));
  } else {
    smartthings[username] = smartthings[username].mac.filter(userMac => mac !== userMac);
    saveConfig(curConfig);
    res.end(JSON.stringify({ status: 'OK' }));
  }
}

module.exports.addUser = addUser;
module.exports.getUsers = getUsers;
module.exports.assignMacToUser = assignMacToUser;
module.exports.removeMacToUser = removeMacToUser;
module.exports.removeUser = removeUser;
