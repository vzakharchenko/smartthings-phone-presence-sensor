
const { Server } = require('node-ssdp');
const env = require('./env');

const { port } = env.config().server;

const ssdpServer = new Server({
  location: {
    port,
    path: '/description.xml',
  },
});

ssdpServer.addUSN('urn:wifimobile:device:vzakharchenko:1');

function description(res) {
  res.end('?xml version=\'1.0\'?>\n'
        + '<root xmlns=\'urn:wifimobile:device:vzakharchenko:1\'>'
        + '</root>');
}

module.exports.ssdpServer = ssdpServer;
module.exports.description = description;
