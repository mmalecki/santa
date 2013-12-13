var animal = require('animal-id');

module.exports = function () {
  return animal.getUuid();
};
