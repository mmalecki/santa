var path = require('path');
var pkgcloud = require('pkgcloud');
var randomName = require('./random-name');
var santa = require('../../');

module.exports = function deploy(options, callback) {
  var client = pkgcloud.compute.createClient(options.compute);

  var bootstrapper = new pkgcloud.compute.Bootstrapper({
    compute: options.compute,
    keys: [
      path.join(process.env.HOME, '.ssh', 'id_rsa'),
      path.join(process.env.HOME, '.ssh', 'id_rsa.pub')
    ]
  });

  client.listKeys(function (err, keys) {
    if (err) {
      return callback(err);
    }

    // Dragons ahead. See https://github.com/nodejitsu/pkgcloud/issues/204.
    bootstrapper.compute.bootstrapOptions = function () {
      return { keynames: keys.map(function (key) { return key.id }) };
    };
    // End of dragons.

    var createOptions = {
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
    };

    santa.inspect.putObject(createOptions);

    callback(null, bootstrapper.createServer(createOptions));
  });
};
