var path = require('path');
var pkgcloud = require('pkgcloud');
var randomName = require('./random-name');
var Bootstrapper = require('pkgcloud-bootstrapper');
var santa = require('../../');

module.exports = function deploy(options, callback) {
  var client = pkgcloud.compute.createClient(options.compute);

  var bootstrapper = new Bootstrapper({
    compute: client,
    keys: [
      path.join(process.env.HOME, '.ssh', 'id_rsa'),
      path.join(process.env.HOME, '.ssh', 'id_rsa.pub')
    ]
  });

  client.listKeys(function (err, keys) {
    if (err) {
      return callback(err);
    }

    var createOptions = {
      name: options.name || randomName(),
      files: [
        { source: options.package, target: 'package.tgz' }
      ],
      commands: [
        'tar -zxvf package.tgz',
        'cd package',
        'scripts/install.sh'
      ],
      keynames: keys.map(function (key) { return key.id }),
      image: '1505699', // TODO: unhardcode from Ubuntu 13.10 x64 on DO
      flavor: '63'      // TODO: unhardcode from 1 GB on DO
    };

    santa.inspect.putObject(createOptions);

    var ee = bootstrapper.createServer(createOptions);

    ee.on('error', function (err) {
      santa.log.error('Error while creating server: ' + err.message);
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

    callback(null, ee);
  });
};
