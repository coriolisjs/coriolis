module.exports = {
  root: true,
  parser: 'babel-eslint',
  env: {
    browser: true,
    es6: true,
  },
  extends: ['standard', 'plugin:prettier/recommended'],
  globals: {},
  rules: {
    'no-sequences': 'off',
  },
}
