var path = require('path');
var santa = require('../..');
var async = require('async');
var readPackageJson = require('read-package-json');
var build = require('../bootstrapper/build.js');
var bootstrap = require('../bootstrapper/bootstrap.js');

module.exports = function (callback) {
  santa.log.info('Imaging application...');
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
      compute: santa.pkgcloud,
      package: results.build,
      name: results.app
      image: santa.argv.image
    };

    image(options, function (err, ee) {
      if (err) {
        santa.log.error('Error while preparing server creation');
        return callback(err);
      }

      ee.on('error', callback);
    });
  });
};
