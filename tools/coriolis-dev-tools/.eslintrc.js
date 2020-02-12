module.exports = {
  root: true,
  parser: 'babel-eslint',
  env: {
    browser: true,
    es2020: true,
  },
  extends: [
    'standard',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:promise/recommended',
    'plugin:prettier/recommended',
  ],
  globals: {},
  rules: {
    'no-sequences': 'off',
  },
}
