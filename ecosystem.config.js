module.exports = {
  apps : [
    {
    name: "Storefront",
    script: './node_modules/next/dist/bin/next',
    args: 'start',
    },
    {
      name: "CronJob",
      script: 'npm',
      args: 'run cron',
    }
  ]
}
