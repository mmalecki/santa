var async = require('async');
var uuid = require('node-uuid');

module.exports = function image(options, callback) {
  var client = options.compute;
  var server = options.server;
  var name = options.name;
  var image;

  santa.log.info('Imaging the server');
  async.waterfall([
    client.shutdownServer.bind(client, server),
    function createImage(next) {
      client.createImage({
        server: server,
        name: name,
      }, next);
    },
    client.destroyServer.bind(client, server)
  ], callback);
};
