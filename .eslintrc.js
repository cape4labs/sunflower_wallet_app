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
  rules: {
    // enable additional rules
    quotes: ['warn', 'single'],
    semi: ['warn', 'always'],
    '@typescript-eslint/no-require-imports': 'warn',
    'no-unused-vars': 'warn',
    'no-undef': 'warn',
  },
};
