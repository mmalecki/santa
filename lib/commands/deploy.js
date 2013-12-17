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
    }, function (err, ee) {
      if (err) {
        santa.log.error('Error while preparing server creation');
        return callback(err);
      }

      ee.on('error', callback);
    });
  });
};
