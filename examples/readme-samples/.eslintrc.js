module.exports = {
  root: true,
  parser: 'babel-eslint',
  extends: ['standard', 'plugin:prettier/recommended'],
  rules: {
    // Coriolis uses sequences pattern for projections definition
    'no-sequences': 'off',
  },
}
