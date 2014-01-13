var path = require('path');
var santa = require('../..');
var async = require('async');
var readPackageJson = require('read-package-json');
var build = require('../bootstrapper/build.js');
var deploy = require('../bootstrapper/deploy.js');

module.exports = function (callback) {
  santa.log.info('Deploying application (hold on to your butts!)...');
  santa.log.info('Building application...');

  var cwd = process.cwd();

  async.parallel({
    build: async.apply(build, { path: cwd }),
    readPackage: async.apply(readPackageJson, path.join(cwd, 'package.json'))
  }, function (err, results) {
    var output;

    if (err) {
      bender.log.error('Build failed');
      return callback(err);
    }

    santa.log.info('Application build to ' + results.build);

    deploy({
      compute: santa.config.get('provider'),
      package: results.build,
      app: results.readPackage
    }, function (err, ee) {
      if (err) {
        santa.log.error('Error while preparing server creation');
        return callback(err);
      }

      ee.on('error', callback);
    });
  });

  build({ path: process.cwd() }, function (err, output) {
  });
};
