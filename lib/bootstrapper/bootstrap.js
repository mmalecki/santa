var path = require('path');
var animal = require('animal-id');
var pkgcloud = require('pkgcloud');
var Bootstrapper = require('pkgcloud-bootstrapper');
var santa = require('../../');
var inspect = require('./inspect');

module.exports = function bootstrap(options, callback) {
  var client = pkgcloud.compute.createClient(options.compute);

  var bootstrapper = new Bootstrapper({
    compute: client,
    keys: [
      path.join(process.env.HOME, '.ssh', 'id_rsa'),
      path.join(process.env.HOME, '.ssh', 'id_rsa.pub')
    ]
  });

  var name = options.name;
  if (!name && options.app) {
    name = options.app.name + '-' + options.app.version + '-' + animal.getId();
  }
  else {
    name = animal.getUuid();
  }

  client.listKeys(function (err, keys) {
    if (err) {
      return callback(err);
    }

    var commands = [
      'tar -zxvf package.tgz',
      'cd package'
    ];

    ['install', 'configure', 'start'].forEach(function (cmd) {
      if (options[cmd]) {
        commands.push('scripts/' + cmd);
      }
    });

    var createOptions = {
      name: name,
      files: [
        { source: options.package, target: 'package.tgz' }
      ],
      commands: commands,
      keynames: keys.map(function (key) { return key.id }),
      image: '1505699', // TODO: unhardcode from Ubuntu 13.10 x64 on DO
      flavor: '63'      // TODO: unhardcode from 1 GB on DO
    };

    santa.inspect.putObject(createOptions);

    var ee = bootstrapper.createServer(createOptions);

    bootstrapper.on(['run', 'ssh', 'stdout'], function (line) {
      santa.log.info(line.data);
    });

    bootstrapper.on(['run', 'ssh', 'stderr'], function (line) {
      santa.log.info(line.data);
    });

    ee.on('error', function (err) {
      santa.log.error('Error while creating server: ' + err.message);
    });

    ee.on('create', function (server) {
      santa.log.info('Server created');
      inspect.server(server);
    });

    ee.on('active', function (server) {
      santa.log.info('Server now active');
      inspect.server(server);
    });

    ee.on('complete', function (server) {
      santa.log.info('Server creation complete');
      inspect.server(server);
    });

    callback(null, ee);
  });
};
