import babel from 'rollup-plugin-babel'

export default {
  input: 'src/index.js',
  output: [
    {
      sourcemap: true,
      format: 'cjs',
      name: 'cjs',
      dir: 'cjs',
    },
  ],
  plugins: [
    babel({
      exclude: 'node_modules/**',
    }),
  ],
  watch: {
    clearScreen: false,
  },
}
