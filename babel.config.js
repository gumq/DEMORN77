// module.exports = {
//   presets: ['module:@react-native/babel-preset'],
//   plugins: [
//     [
//       'module-resolver',
//       {
//         root: ['./src/'],
//         alias: {
//           '@components': './src/components',
//           '@context': './src/context',
//           '@screens': './src/modules',
//           '@routes': './src/modules/routes',
//           '@store': './src/store',
//           '@themes': './src/themes',
//           '@utils': './src/utils',
//           '@resolutions': './src/utils/resolutions',
//           '@api': './src/action/Api',
//           '@assets': './src/assets',
//           '@storage': './src/storage',
//           '@constants': './src/constants',
//           '@svgImg': './src/svgImg',
//           '@navigation': './src/modules/navigation',
//           '@services': './src/services',
//         },
//       },
//     ],
//   ],
// };
// module.exports = {
//   presets: ['module:metro-react-native-babel-preset'],
//   plugins: [
//     ['@babel/plugin-transform-class-properties', {loose: true}],
//     ['@babel/plugin-transform-private-methods', {loose: true}],
//     ['@babel/plugin-transform-private-property-in-object', {loose: true}],
//     [
//       'module-resolver',
//       {
//         root: ['./src/'],
//         alias: {
//           '@components': './src/components',
//           '@context': './src/context',
//           '@screens': './src/modules',
//           '@routes': './src/modules/routes',
//           '@store': './src/store',
//           '@themes': './src/themes',
//           '@utils': './src/utils',
//           '@resolutions': './src/utils/resolutions',
//           '@api': './src/action/Api',
//           '@assets': './src/assets',
//           '@storage': './src/storage',
//           '@constants': './src/constants',
//           '@svgImg': './src/svgImg',
//           '@navigation': './src/modules/navigation',
//           '@services': './src/services',
//         },
//       },
//     ],
//   ],
// };
module.exports = {
  presets: ['@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          '@components': './src/components',
          '@context': './src/context',
          '@screens': './src/modules',
          '@routes': './src/modules/routes',
          '@store': './src/store',
          '@themes': './src/themes',
          '@utils': './src/utils',
          '@resolutions': './src/utils/resolutions',
          '@api': './src/action/Api',
          '@assets': './src/assets',
          '@storage': './src/storage',
          '@constants': './src/constants',
          '@svgImg': './src/svgImg',
          '@navigation': './src/modules/navigation',
          '@services': './src/services',
        },
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
      },
    ],
  ],
};
