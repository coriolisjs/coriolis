module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true
  },
  extends: [
    'standard'
  ],
  globals: {
  },
  parserOptions: {
    ecmaVersion: 2018
  },
  rules: {
    'no-sequences': 'off'
  },
  overrides: [{
    files: ['src/test/**/*.js'],
    env: {
      mocha: true,
    },
    globals: {
      expect: true,
      sinon: true,
    },
  }]
}
