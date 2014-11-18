var path = require('path');
var fs = require('fs');
var flatiron = require('flatiron');
var pkgcloud = require('pkgcloud');
var santa = module.exports = flatiron.app;

santa.use(flatiron.plugins.cli, {
  version: true,
  source: path.join(__dirname, 'commands'),
  usage: [
    'Welcome to santa!',
    '',
    'Available commands:',
    '',
    'Servers',
    '',
    '  santa servers list',
    '  santa servers destroy <id>',
    '',
    '',
    'Images',
    '',
    '  santa images list',
    '',
    'Flavors',
    '',
    '  santa flavors list',
    '',
    'Deployment',
    '',
    '  santa deploy',
    ''
  ]
});

var packageUri = path.join(process.cwd(), 'package.json');
var santaConf = {};
try {
  santaConf = JSON.parse(fs.readFileSync(packageUri)).santa || {}
} catch (err) {
  /* do nothing */
}

santa.config
  .env()
  .file(santa.argv.config || santa.argv.c || path.join(process.env.HOME, '.santaconf'))
  .defaults(santaConf)

santa.use(require('flatiron-cli-config'), {
  store: 'file'
});

santa.pkgcloud = pkgcloud.compute.createClient(santa.config.get('provider'));
