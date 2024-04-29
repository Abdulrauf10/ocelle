import { CronJob } from 'cron';

import recurringBoxScheduler from './schedulers/recurringBox';

function cron() {
  new CronJob(
    '0 0 0 * * *', // run every day at 00:00
    recurringBoxScheduler,
    undefined,
    true, // start on init
    process.env.TZ, // timeZone
    undefined,
    true
  );
}

cron();
