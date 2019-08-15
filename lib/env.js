const fs = require('fs');

const config = function parseConfigs() {
  const defaultConfigFile = './config/config.json';
  const configJson = JSON.parse(fs.readFileSync(defaultConfigFile, 'UTF-8'));
  Object.assign(configJson, { configFile: defaultConfigFile });
  const ovverideConfigFile = './config/userConfig.json';
  if (fs.existsSync(ovverideConfigFile)) {
    const overrideConfig = JSON.parse(fs.readFileSync(ovverideConfigFile, 'UTF-8'));
    Object.assign(configJson, overrideConfig);
    Object.assign(configJson, { configFile: ovverideConfigFile });
  }
  const configFile = '/opt/config/asusConfig.json';
  if (fs.existsSync(configFile)) {
    const overrideConfig = JSON.parse(fs.readFileSync(configFile, 'UTF-8'));
    Object.assign(configJson, overrideConfig);
    Object.assign(configJson, { configFile });
  }
  return configJson;
};

const saveConfig = function n(changeConfig) {
  const currentConfig = config();
  const updatedConfig = Object.assign({}, currentConfig, changeConfig);
  delete updatedConfig.configFile;
  fs.writeFileSync(currentConfig.configFile, JSON.stringify(updatedConfig));
};

const def = config();

function selectRouterType(asus, tplink) {
  if (!def.router.router) {
    def.router.router = 'asus';
  }
  if (def.router.router.toLowerCase() === 'asus') {
    return asus();
  } if (def.router.router.toLowerCase() === 'tplink') {
    return tplink();
  }
  throw new Error('Unknown router Type');
}

module.exports.config = def;
module.exports.saveConfig = saveConfig;
module.exports.selectRouterType = selectRouterType;
