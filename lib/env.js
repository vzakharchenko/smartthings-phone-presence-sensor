const fs = require('fs');

const config = function parseConfigs() {
  const configJson = {};
  const defaultConfigFile = './config/config.json';
  if (fs.existsSync(defaultConfigFile)) {
    const defaultConfigJson = JSON.parse(fs.readFileSync(defaultConfigFile, 'UTF-8'));
    Object.assign(configJson, defaultConfigJson);
    Object.assign(configJson, { configFile: defaultConfigFile });
  }
  const ovverideConfigFile = './config/userConfig.json';
  if (fs.existsSync(ovverideConfigFile)) {
    const overrideConfig = JSON.parse(fs.readFileSync(ovverideConfigFile, 'UTF-8'));
    Object.assign(configJson, overrideConfig);
    Object.assign(configJson, { configFile: ovverideConfigFile });
  }
  const configFile = '/opt/config/routerConfig.json';
  if (fs.existsSync(configFile)) {
    const overrideConfig = JSON.parse(fs.readFileSync(configFile, 'UTF-8'));
    Object.assign(configJson, overrideConfig);
    Object.assign(configJson, { configFile });
  }
  if (!configJson.server.mobilePresenceJob) {
    configJson.server.mobilePresenceJob = '0 */5 * * * *';
  }
  return configJson;
};

const saveConfig = function n(changeConfig) {
  const currentConfig = config();
  const updatedConfig = { ...currentConfig, ...changeConfig };
  delete updatedConfig.configFile;
  fs.writeFileSync(currentConfig.configFile, JSON.stringify(updatedConfig, null, 1));
};

const def = config;

function selectRouterType(asus, tplink, mikrotik) {
  const { router } = config();
  if (!router.router) {
    router.router = 'asus';
  }
  if (router.router.toLowerCase() === 'asus') {
    return asus();
  } if (router.router.toLowerCase() === 'tplink') {
    return tplink();
  }
  if (router.router.toLowerCase() === 'mikrotik') {
    return mikrotik();
  }
  throw new Error('Unknown router Type');
}

module.exports.config = def;
module.exports.saveConfig = saveConfig;
module.exports.selectRouterType = selectRouterType;
