const { exec } = require('child_process');
const logger = require('./logger');
const { saveConfig, config } = require('./env.js');

function getSettings(req, res) {
  if (!config().smartthings) {
    res.end(JSON.stringify({ status: 'FAIL', message: ' Wrong Configuration File' }));
  } else {
    const c = JSON.parse(JSON.stringify(config()));
    if (c.router) {
      c.router.password = '*';
      delete c.router.encryptedPassword;
    }
    delete c.configFile;
    res.end(JSON.stringify({ status: 'OK', data: c }));
  }
}

function saveSetting(req, res) {
  const reqConfig = req.body;
  if (reqConfig.router) {
    if (reqConfig.router.password === '*') {
      delete reqConfig.router.password;
    } else {
      delete reqConfig.router.encryptedPassword;
    }
  }
  const curConfig = { ...config(), ...reqConfig };
  saveConfig(curConfig);
  res.end(JSON.stringify({ status: 'OK' }));
  exec(
    'pm2 restart RouterSmartAppServer.js',
    (error, stdout, stderr) => {
      logger.debug(`stdout: ${stdout}`);
      logger.debug(`stderr: ${stderr}`);
      if (error !== null) {
        logger.error(`exec error: ${error}`);
      }
    },
  );
}

module.exports.getSettings = getSettings;
module.exports.saveSetting = saveSetting;
