var path = require('path');
var santa = require('../..');
var async = require('async');
var animal = require('animal-id');
var readPackageJson = require('read-package-json');
var build = require('../bootstrapper/build.js');
var bootstrap = require('../bootstrapper/bootstrap.js');

module.exports = function (callback) {
  var flavor = santa.config.get('flavor');
  var image = santa.config.get('image');

  if (!flavor || !image) {
    santa.log.error('Flavor and image (`--flavor` and `--image`) are required');
    return;
  }

  santa.log.info('Deploying application (hold on to your butts!)...');
  santa.log.info('Building application...');

  var cwd = process.cwd();

  async.parallel({
    build: async.apply(build, { path: cwd }),
    package: async.apply(readPackageJson, path.join(cwd, 'package.json'))
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
      name: [ results.package.name, results.package.version, animal.getId() ].join('-'),
      flavor: flavor,
      image: image
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
