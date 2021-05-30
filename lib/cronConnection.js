const { CronJob } = require('cron');
const {
  getSupportedClients,
} = require('./wifi.js');

const {
  config,
} = require('./env');

const logger = require('./logger');

const { selectRouterType } = require('./env');
const { getListOfAllUsers } = require('./tplink/TPLinkManager');
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
      const response = {
        status: 'Error',
        message: err,
      };
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
