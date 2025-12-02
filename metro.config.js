// const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

// /**
//  * Metro configuration
//  * https://facebook.github.io/metro/docs/configuration
//  *
//  * @type {import('metro-config').MetroConfig}
//  */
// const config = {};

// module.exports = mergeConfig(getDefaultConfig(__dirname), config);
const {getDefaultConfig} = require('@react-native/metro-config');
const path = require('path');

const projectRoot = __dirname;

const config = getDefaultConfig(projectRoot);

config.resolver.extraNodeModules = {
  '@components': path.resolve(projectRoot, 'src/components'),
  '@context': path.resolve(projectRoot, 'src/context'),
  '@screens': path.resolve(projectRoot, 'src/modules'),
  '@routes': path.resolve(projectRoot, 'src/modules/routes'),
  '@store': path.resolve(projectRoot, 'src/store'),
  '@themes': path.resolve(projectRoot, 'src/themes'),
  '@utils': path.resolve(projectRoot, 'src/utils'),
  '@resolutions': path.resolve(projectRoot, 'src/utils/resolutions'),
  '@api': path.resolve(projectRoot, 'src/action/Api'),
  '@assets': path.resolve(projectRoot, 'src/assets'),
  '@storage': path.resolve(projectRoot, 'src/storage'),
  '@constants': path.resolve(projectRoot, 'src/constants'),
  '@svgImg': path.resolve(projectRoot, 'src/svgImg'),
  '@navigation': path.resolve(projectRoot, 'src/modules/navigation'),
  '@services': path.resolve(projectRoot, 'src/services'),
};

module.exports = config;
