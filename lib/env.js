const fs = require('fs');

const config = function parseConfigs() {
  const configJson = JSON.parse(fs.readFileSync('./config/config.json', 'UTF-8'));
  if (fs.existsSync('./config/overrideConfig.json')) {
    const overrideConfig = JSON.parse(fs.readFileSync('./config/overrideConfig.json', 'UTF-8'));
    Object.assign(configJson, overrideConfig);
  }
  if (fs.existsSync('/opt/config/asusConfig.json')) {
    const overrideConfig = JSON.parse(fs.readFileSync('/opt/config/asusConfig.json', 'UTF-8'));
    Object.assign(configJson, overrideConfig);
  }
  return configJson;
};

const def = config();

module.exports.config = def;
