module.exports = {
  preset: 'react-native',
  // Transpile these modules explicitly since they cause issues when used with jest and are
  // located in node_modules which is ignored by default by jest
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation|@scure|@noble)/)',
  ],
  setupFiles: ['./jest.setup.js'],
};
