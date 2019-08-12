
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const env = require('./lib/env.js');
const {
  addUser,
  getUsers,
  assignMacToUser,
  removeMacToUser,
  removeUser,
} = require('./lib/userManager');
const { getListComponents } = require('./lib/componentManager');
const { smartthingsInit } = require('./lib/smartthingsConnection.js');
const {
  createNetwork, deleteNetwork, getAllNetworkUI,
} = require('./lib/modifyNetwork.js');
const {
  presenceMobiles, blockUserMac, blockedUserMac, presenceMobilesUI,
} = require('./lib/presenceMobile.js');

const corsOptions = {
  origin(o, callback) {
    callback(null, true);
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: true,
  credentials: true,
  maxAge: 3600,
};

const server = express();
server.use(bodyParser.json());
const port = env.config.server.port;
const appId = env.config.smartapp.appId;


server.get('/health', cors(corsOptions), (req, res) => {
  const status = { status: 'OK' };
  res.send(JSON.stringify(status));
});

server.get(`/${appId}/createGuestNetwork`, cors(corsOptions), (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  createNetwork(req, res);
});

server.get(`/${appId}/deleteGuestNetwork`, cors(corsOptions), (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  deleteNetwork(req, res);
});

// server.get(`/getGuestNetwork`, (req, res) => {
//   res.writeHead(200, { 'Content-Type': 'application/json' });
//   getNetwork(req, res);
// });

server.get('/getAllNetwork', cors(corsOptions), (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  // getAllNetwork(req, res);
  res.end(JSON.stringify({ status: 'OK' }));// todo  return back getAllNetwork(req, res);
});

server.get('/presenceMobiles', cors(corsOptions), (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  presenceMobiles(req, res);
});

server.get(`/${appId}/blockMac'`, cors(corsOptions), (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  blockUserMac(req, res);
});

server.get(`/${appId}/BlockedMacs`, cors(corsOptions), (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  blockedUserMac(req, res);
});

// BACKEND UI SERVICES

server.get('/ui/components', cors(corsOptions), (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  getListComponents(req, res);
});

server.post('/ui/addUser', cors(corsOptions), (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  addUser(req, res);
});

server.post('/ui/removeUser', cors(corsOptions), (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  removeUser(req, res);
});

server.get('/ui/getUsers', cors(corsOptions), (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  getUsers(req, res);
});

server.get('/ui/networks', cors(corsOptions), (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  getAllNetworkUI(req, res);
});

server.get('/ui/presenceMobiles', cors(corsOptions), (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  presenceMobilesUI(req, res);
});

server.post('/ui/assignMac', cors(corsOptions), (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  assignMacToUser(req, res);
});

server.post('/ui/removeMacToUser', cors(corsOptions), (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  removeMacToUser(req, res);
});

smartthingsInit().then((res) => {
  console.info(`app initialized successfully ${res}`);
  server.listen(port, () => {
    console.info(`HTTP asus-guest-network listening on port ${port}`);
  });
}).catch((e) => {
  console.error(`Initialization error: ${e}`);
  console.error('Please first install DTH`s then smartapp, Do not forget to enable OAuth in SmartApp IDE settings!');
  console.error('and after that edit ./config/config.js, and setup smartapp.appId and smartapp.accessToken');
  console.info(`Current appId=${env.config.smartapp.appId}`);
  console.info(`Current accessToken=${env.config.smartapp.accessToken}`);
});

