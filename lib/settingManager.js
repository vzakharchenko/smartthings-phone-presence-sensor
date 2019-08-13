const { exec } = require('child_process');
const { saveConfig, config } = require('./env.js');

function getSettings(req, res) {
  if (!config.smartthings) {
    res.end(JSON.stringify({ status: 'FAIL', message: ' Wrong Configuration File' }));
  } else {
    res.end(JSON.stringify({ status: 'OK', data: config }));
  }
}

function saveSetting(req, res) {
  const reqConfig = req.body;
  const curConfig = Object.assign({}, config, reqConfig);
  saveConfig(curConfig);
  res.end(JSON.stringify({ status: 'OK' }));
  exec(
    'pm2 restart AsusSmartAppServer.js',
    (error, stdout, stderr) => {
      console.log(`stdout: ${stdout}`);
      console.log(`stderr: ${stderr}`);
      if (error !== null) {
        console.log(`exec error: ${error}`);
      }
    },
  );
}

module.exports.getSettings = getSettings;
module.exports.saveSetting = saveSetting;
