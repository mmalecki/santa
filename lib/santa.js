var path = require('path');
var flatiron = require('flatiron');
var pkgcloud = require('pkgcloud');
var santa = module.exports = flatiron.app;

santa.use(flatiron.plugins.cli, {
  version: true,
  source: path.join(__dirname, 'commands'),
  usage: [
    'Welcome to santa!'
  ]
});

santa.config
  .env()
  .file(santa.argv.config || santa.argv.c || path.join(process.env.HOME, '.santaconf'));

santa.use(require('flatiron-cli-config'), {
  store: 'file'
});

santa.pkgcloud = pkgcloud.compute.createClient(santa.config.get('provider'));
