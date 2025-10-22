module.exports = {
  root: true,
  extends: '@react-native',
  overrides: [
    {
      // https://callstack.github.io/react-native-testing-library/docs/start/quick-start#eslint-plugin
      // Test files only
      files: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
      extends: ['plugin:testing-library/react'],
    },
  ],
};
