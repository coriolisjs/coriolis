module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
  },
  extends: ['standard', 'plugin:import/errors', 'plugin:prettier/recommended'],
  globals: {},
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    'no-sequences': 'off',
  },
}
