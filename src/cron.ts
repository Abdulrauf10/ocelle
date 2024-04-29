import { CronJob } from 'cron';

import subscriptionScheduler from './schedulers/subscription';

function cron() {
  new CronJob(
    '1 0 0 * * *', // run every day at 00:01
    subscriptionScheduler, // onTick
    undefined,
    true, // start
    process.env.TZ, // timeZone
    undefined,
    true
  );
}

cron();
