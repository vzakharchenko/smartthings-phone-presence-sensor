const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const env = require('./lib/env');
const {
  getUsers,
  assignMacToUser,
  removeMacToUser,
  removeUser,
  assignShard,
  addUser,
} = require('./lib/userManager');
const { getListComponents } = require('./lib/componentManager');
const { getAllNetwork, getAllNetworkUI } = require('./lib/modifyNetwork');
const {
  presenceMobiles,
  blockUserMac,
  unBlockUserMac,
  presenceMobilesUI,
} = require('./lib/presenceMobile');
const logger = require('./lib/logger');
const { saveSmartThingDeviceInfo } = require('./lib/registerDevice');

const {
  getSettings, saveSetting,
} = require('./lib/settingManager');
const {
  connectKeycloak, protect,
} = require('./lib/keycloakConnection');
const {
  installCrons,
} = require('./lib/cronConnection');

const corsOptions = {
  origin(o, callback) {
    callback(null, true);
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: true,
  credentials: true,
  maxAge: 3600,
};

const { port } = env.config().server;

const server = express();

server.use(bodyParser.json());

server.use(cors(corsOptions));

connectKeycloak(server);

server.get('/health', cors(corsOptions), (req, res) => {
  const status = { status: 'OK' };
  res.send(JSON.stringify(status));
});

// server.get('/createGuestNetwork', cors(corsOptions), (req, res) => {
//   res.writeHead(200, { 'Content-Type': 'application/json' });
//   createNetwork(req, res);
// });

// server.get('/deleteGuestNetwork', cors(corsOptions), (req, res) => {
//   res.writeHead(200, { 'Content-Type': 'application/json' });
//   deleteNetwork(req, res);
// });

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

server.post('/blockMac', cors(corsOptions), (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  blockUserMac(req, res);
});

server.post('/unBlockMac', cors(corsOptions), (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  unBlockUserMac(req, res);
});

// server.get('/BlockedMacs', cors(corsOptions), (req, res) => {
//   res.writeHead(200, { 'Content-Type': 'application/json' });
//   blockedUserMac(req, res);
// });

server.post('/registerDevice', cors(corsOptions), (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  saveSmartThingDeviceInfo(req, res);
});

// BACKEND UI SERVIC9mi8ES

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

server.post('/ui/removeUser', protect(), cors(corsOptions), (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  removeUser(req, res);
});

server.get('/ui/getUsers', protect(), cors(corsOptions), (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  getUsers(req, res);
});

server.post('/ui/addUser', protect(), cors(corsOptions), (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  addUser(req, res);
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

server.post('/ui/blockMac', protect(), cors(corsOptions), (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  blockUserMac(req, res);
});

server.post('/ui/unBlockMac', protect(), cors(corsOptions), (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  unBlockUserMac(req, res);
});

server.post('/ui/assignShard', protect(), cors(corsOptions), (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  assignShard(req, res);
});

server.post('/ui/removeMacToUser', protect(), cors(corsOptions), (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  removeMacToUser(req, res);
});
server.listen(port, () => {
  logger.info(`HTTP asus-guest-network listening on port ${port}`);
  installCrons();
});

process.on('exit', () => {
  server.stop();
});
