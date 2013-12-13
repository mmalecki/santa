var path = require('path');
var pkgcloud = require('pkgcloud');
var randomName = require('./random-name');

module.exports = function deploy(options) {
  var bootstrapper = new pkgcloud.compute.Bootstrapper({
    compute: options.compute,
    keys: [
      path.join(process.env.HOME, '.ssh', 'id_rsa'),
      path.join(process.env.HOME, '.ssh', 'id_rsa.pub')
    ]
  });

  var ee = bootstrapper.createServer({
    name: options.name || randomName(),
    files: [
      { source: options.package, target: 'package.tgz' }
    ],
    commands: [
      'tar -zxvf package.tgz',
      'cd package'
    ],
    imageId: '1505699', // TODO: unhardcode from Ubuntu 13.10 x64 on DO
    flavorId: '63'      // TODO: unhardcode from 1 GB on DO
  });

  return ee;
};
