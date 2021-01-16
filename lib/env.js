const fs = require('fs');

const config = function parseConfigs() {
  const configJson = {};
  const defaultConfigFile = './config/config.json';
  if (fs.existsSync(defaultConfigFile)) {
    const defaultConfigJson = JSON.parse(fs.readFileSync(defaultConfigFile, 'UTF-8') || '{}');
    Object.assign(configJson, defaultConfigJson);
    Object.assign(configJson, { configFile: defaultConfigFile });
  }
  const ovverideConfigFile = './config/userConfig.json';
  if (fs.existsSync(ovverideConfigFile)) {
    const overrideConfig = JSON.parse(fs.readFileSync(ovverideConfigFile, 'UTF-8') || '{}');
    Object.assign(configJson, overrideConfig);
    Object.assign(configJson, { configFile: ovverideConfigFile });
  }
  const homeConfigFile = `${process.env.HOME}/config/userConfig.json`;
  if (fs.existsSync(homeConfigFile)) {
    const overrideConfig = JSON.parse(fs.readFileSync(homeConfigFile, 'UTF-8') || '{}');
    Object.assign(configJson, overrideConfig);
    Object.assign(configJson, { configFile: homeConfigFile });
  }
  const configFile = '/opt/config/routerConfig.json';
  if (fs.existsSync(configFile)) {
    const overrideConfig = JSON.parse(fs.readFileSync(configFile, 'UTF-8') || '{}');
    Object.assign(configJson, overrideConfig);
    Object.assign(configJson, { configFile });
  }
  const configFile2 = '/opt/config/router/config.json';
  if (fs.existsSync(configFile2)) {
    const overrideConfig = JSON.parse(fs.readFileSync(configFile2, 'UTF-8') || '{}');
    Object.assign(configJson, overrideConfig);
    Object.assign(configJson, { configFile: configFile2 });
  }
  const configFile3 = '/opt/config/router/routerConfig.json';
  if (fs.existsSync(configFile3)) {
    const overrideConfig = JSON.parse(fs.readFileSync(configFile3, 'UTF-8') || '{}');
    Object.assign(configJson, overrideConfig);
    Object.assign(configJson, { configFile: configFile3 });
  }
  if (!configJson.server) {
    configJson.server = {
      port: 5000,
    };
  }
  if (!configJson.smartthings) {
    configJson.smartthings = {};
  }
  if (!configJson.router) {
    configJson.router = {
      routerIp: '',
      routerPort: 80,
      httpOrhttps: 'http',
      userName: '',
      password: '',
      router: 'asus',
    };
  }
  if (!configJson.asus) {
    configJson.asus = {
      guestWifi: {
        guestWifiDefaultTemplate: {
          bss_enabled: '1',
          ssid: 'SmartThings_Guest',
          auth_mode_x: 'pskpsk2',
          crypto: 'aes',
          key: '1',
          psk: null,
          lanaccess: 'off',
          expire: '0',
          expire_tmp: '0',
          macmode: 'disabled',
          mbss: '1',
          wpa_psk: '',
          wl_unit: '0',
          wl_subunit: '1',
          action_mode: 'apply',
          rc_service: 'restart_wireless;restart_qos;restart_firewall;',
        },
      },
    };
  }
  if (!configJson.smartapp) {
    configJson.smartapp = [
      'https://graph.api.smartthings.com',
      'https://graph-na02-useast1.api.smartthings.com',
      'https://graph-na04-useast2.api.smartthings.com',
      'https://graph-eu01-euwest1.api.smartthings.com',
      'https://graph-ap02-apnortheast2.api.smartthings.com',
    ];
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
  let configFile = currentConfig.configFile;
  if (!configFile || currentConfig.configFile === './config/config.json') {
    fs.mkdirSync(`${process.env.HOME}/config/`, { recursive: true });
    configFile = `${process.env.HOME}/config/userConfig.json`;
  }
  fs.writeFileSync(configFile, JSON.stringify(updatedConfig, null, 1));
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
