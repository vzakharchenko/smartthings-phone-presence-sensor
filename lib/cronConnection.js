const { CronJob } = require('cron');
const {
  getSupportedClients,
} = require('./wifi.js');

const {
  config,
} = require('./env.js');

const { selectRouterType } = require('./env.js');
const { getListOfAllUsers } = require('./tplink/TPLinkManager.js');

function presenceMobiles() {
  selectRouterType(() => getSupportedClients(), () => getListOfAllUsers())
    .then((r) => {
      const s = { status: 'OK', data: r };
      console.log(`SUCCESS presenceMobiles executed ${JSON.stringify(s)}`);
    }).catch((err) => {
      const response = Object.assign({}, {
        status: 'Error',
        message: err,
      });
      console.error(`FAIL presenceMobiles executed ${JSON.stringify(response)}`);
    });
}

function installCrons() {
  const cronJob = new CronJob(config().server.mobilePresenceJob, (() => {
    presenceMobiles();
  }), null, true, 'America/Los_Angeles');
  console.log('System TZ next 5: ', cronJob.nextDates(5));
}
module.exports.installCrons = installCrons;
