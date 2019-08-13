
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
// const { smartthingsInit } = require('./lib/smartthingsConnection');
const {
  createNetwork, deleteNetwork, getAllNetwork, getAllNetworkUI,
} = require('./lib/modifyNetwork');
const {
  presenceMobiles, blockUserMac, blockedUserMac, presenceMobilesUI,
} = require('./lib/presenceMobile');

const {
  getSettings, saveSetting,
} = require('./lib/settingManager');
const {
  connectKeycloak, protect,
} = require('./lib/keycloakConnection');

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

server.use(cors(corsOptions));

connectKeycloak(server);

const { port } = env.config.server;
const { appId } = env.config.smartapp;


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
  getAllNetwork(req, res);
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

server.use('/', protect(), express.static(`${__dirname}/router-ui/public`));

server.get('/ui/components', protect(), cors(corsOptions), (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  getListComponents(req, res);
});

server.get('/ui/settings', protect(), cors(corsOptions), (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  getSettings(req, res);
});

server.post('/ui/settings', protect(), cors(corsOptions), (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  saveSetting(req, res);
});


server.post('/ui/addUser', protect(), cors(corsOptions), (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  addUser(req, res);
});

server.post('/ui/removeUser', protect(), cors(corsOptions), (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  removeUser(req, res);
});

server.get('/ui/getUsers', protect(), cors(corsOptions), (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  getUsers(req, res);
});

server.get('/ui/networks', protect(), cors(corsOptions), (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  getAllNetworkUI(req, res);
});

server.get('/ui/presenceMobiles', protect(), cors(corsOptions), (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  presenceMobilesUI(req, res);
});

server.post('/ui/assignMac', protect(), cors(corsOptions), (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  assignMacToUser(req, res);
});

server.post('/ui/removeMacToUser', protect(), cors(corsOptions), (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  removeMacToUser(req, res);
});
server.listen(port, () => {
  console.info(`HTTP asus-guest-network listening on port ${port}`);
});
