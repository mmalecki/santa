var santa = require('../..');
var build = require('../utils/build.js');
var deploy = require('../utils/deploy.js');

module.exports = function (callback) {
  santa.log.info('Deploying application (hold on to your butts!)...');
  santa.log.info('Building application...');

  build({ path: process.cwd() }, function (err, output) {
    if (err) {
      bender.log.error('Build failed');
      return callback(err);
    }

    santa.log.info('Application build to ' + output);

    var ee = deploy({
      compute: santa.config.get('provider'),
      package: output
    });

    ee.on('error', function (err) {
      santa.log.error('Error while creating server');
      return callback(err);
    });

    ee.on('create', function () {
      santa.log.info('Server created');
    });

    ee.on('active', function () {
      santa.log.info('Server now active');
    });

    ee.on('complete', function () {
      santa.log.info('Server creation complete');
    });
  });
};
