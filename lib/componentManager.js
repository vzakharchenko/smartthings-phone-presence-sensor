
function getListComponents(req, res) {
  res.end(JSON.stringify({
    status: 'OK',
    data: [
      'users',
      'macs',
      'networks',
      'devices',
      'asus',
      'smartapp',
      'serverConfig'],
  }));
}

module.exports.getListComponents = getListComponents;
