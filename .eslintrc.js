module.exports = {
  root: true,
  parser: 'babel-eslint',
  extends: [
    'standard',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:promise/recommended',
    'plugin:prettier/recommended',
  ],
  globals: {
    performance: 'readonly',
    process: 'readonly',
  },
  rules: {
    // Coriolis uses sequences pattern for projections definition
    'no-sequences': 'off',
  },
  overrides: [
    {
      files: ['src/test/**/*.js'],
      env: {
        mocha: true,
      },
      globals: {
        expect: true,
        sinon: true,
        withParams: true,
        useParams: true,
      },
    },
  ],
}
