var path = require('path');
var flatiron = require('flatiron');
var santa = module.exports = flatiron.app;

santa.use(flatiron.plugins.cli, {
  version: true,
  source: path.join(__dirname, 'commands'),
  usage: [
    'Welcome to santa!'
  ]
});
