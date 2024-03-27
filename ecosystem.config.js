module.exports = {
  apps : [{
    name   : "Storefront",
    script: './node_modules/next/dist/bin/next',
    args: 'start',
    env: {
      "TZ": "Asia/Hong_Kong",
    }
  }]
}
