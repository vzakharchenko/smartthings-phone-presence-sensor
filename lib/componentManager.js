
function getListComponents(req, res) {
  res.end(JSON.stringify({ status: 'OK', data: ['users', 'macs', 'networks','devices', 'asus'] })); // todo only asus
}

module.exports.getListComponents = getListComponents;
