// Polyfill for Node < 18.14: os.availableParallelism() added in Node 18.14.0
// Required by metro@0.81 (Expo SDK 52). Remove once Node is upgraded to >=18.14.
if (typeof require('os').availableParallelism !== 'function') {
  require('os').availableParallelism = () => require('os').cpus().length;
}

const {getDefaultConfig} = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

module.exports = config;
