const { CronJob } = require('cron');
const {
  getSupportedClients,
} = require('./wifi.js');

const {
  config,
} = require('./env.js');

const logger = require('./logger');

const { selectRouterType } = require('./env.js');
const { getListOfAllUsers } = require('./tplink/TPLinkManager.js');
const { getRouteOSListOfAllUsers } = require('./mikrotik/MikrotikManager');

function presenceMobiles() {
  selectRouterType(
    () => getSupportedClients(),
    () => getListOfAllUsers(),
    () => getRouteOSListOfAllUsers(),
  )
    .then((r) => {
      const s = { status: 'OK', data: r };
      logger.debug(`SUCCESS presenceMobiles executed ${JSON.stringify(s)}`);
    }).catch((err) => {
      const response = Object.assign({}, {
        status: 'Error',
        message: err,
      });
      logger.error(`FAIL presenceMobiles executed ${JSON.stringify(response)}`);
    });
}

function installCrons() {
  const cronJob = new CronJob(config().server.mobilePresenceJob, (() => {
    presenceMobiles();
  }), null, true, 'America/Los_Angeles');
  logger.debug('System TZ next 5: ', cronJob.nextDates(5));
}
module.exports.installCrons = installCrons;
