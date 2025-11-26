module.exports = {
  presets: ['module:@react-native/babel-preset', 'nativewind/babel'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./'],
        // TODO Add the second alias for the package which is now in
        // 'shared' top level folder but first choose a name for the package
        alias: {
          "@": "./src",
        },
      },
    ],
  ],
};
