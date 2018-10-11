const express = require('express');
const env = require('./lib/env.js');
const { smartthingsInit } = require('./lib/smartthingsConnection.js');
const {
  createNetwork, deleteNetwork, getNetwork, getAllNetwork,
} = require('./lib/modifyNetwork.js');
const {
  presenceMobiles, deviceMetadata, blockUserMac, blockedUserMac,
} = require('./lib/presenceMobile.js');


const server = express();
const port = env.config.server.port;


server.get('/health', (req, res) => {
  const status = { status: 'OK' };
  res.send(JSON.stringify(status));
});

server.get('/createGuestNetwork', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  createNetwork(req, res);
});

server.get('/deleteGuestNetwork', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  deleteNetwork(req, res);
});

server.get('/getGuestNetwork', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  getNetwork(req, res);
});

server.get('/getAllNetwork', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  getAllNetwork(req, res);
});

server.get('/presenceMobiles', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  presenceMobiles(req, res);
});

server.get('/deviceMetadata', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  deviceMetadata(req, res);
});

server.get('/deviceMetadata', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  deviceMetadata(req, res);
});

server.get('/blockMac', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  blockUserMac(req, res);
});

server.get('/BlockedMacs', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  blockedUserMac(req, res);
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

