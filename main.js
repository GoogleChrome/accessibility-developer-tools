// This exposes the ./dist Javascript file for node libraries.
// It also unwraps the main axs package so Audit and other objects are exposed
// directly in the node library

var library = require('./dist/js/axs_testing'); // eslint-disable-line no-undef

module.exports = library.axs; // eslint-disable-line no-undef
