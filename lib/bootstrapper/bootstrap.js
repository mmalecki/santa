var path = require('path');
var pkgcloud = require('pkgcloud');
var Bootstrapper = require('pkgcloud-bootstrapper');
var santa = require('../../');
var inspect = require('../utils/inspect');
var image = require('./image.js');

module.exports = function bootstrap(options, callback) {
  var client = options.compute;

  var bootstrapper = new Bootstrapper({
    compute: client,
    keys: [
      path.join(process.env.HOME, '.ssh', 'id_rsa'),
      path.join(process.env.HOME, '.ssh', 'id_rsa.pub')
    ]
  });

  var name = options.name;

  client.listKeys(function (err, keys) {
    if (err) {
      return callback(err);
    }

    var commands = [
      'tar -zxvf package.tgz',
      'cd package'
    ];

    var scripts = options.scripts || ['install', 'configure', 'start'];
    Array.prototype.push.apply(commands, scripts.map(function (script) {
      return 'scripts/' + script;
    }));

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
      callback(null, server);
    });
  });
};
