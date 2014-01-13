var path = require('path');
var santa = require('../..');
var async = require('async');
var readPackageJson = require('read-package-json');
var build = require('../bootstrapper/build.js');
var bootstrap = require('../bootstrapper/bootstrap.js');

module.exports = function (callback) {
  santa.log.info('Deploying application (hold on to your butts!)...');
  santa.log.info('Building application...');

  var cwd = process.cwd();

  async.parallel({
    build: async.apply(build, { path: cwd }),
    readPackage: async.apply(readPackageJson, path.join(cwd, 'package.json'))
  }, function (err, results) {
    var output, options;

    if (err) {
      bender.log.error('Build failed');
      return callback(err);
    }

    santa.log.info('Application build to ' + results.build);

    options = {
      compute: santa.config.get('provider'),
      package: results.build,
      app: results.readPackage,
      image: santa.argv.image
    };

    bootstrap(options, function (err, ee) {
      if (err) {
        santa.log.error('Error while preparing server creation');
        return callback(err);
      }

      ee.on('error', callback);
    });
  });
};
