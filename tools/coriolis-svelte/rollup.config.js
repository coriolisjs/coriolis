import babel from 'rollup-plugin-babel'

export default {
  input: 'provideStore.js',
  output: [
    {
      sourcemap: true,
      format: 'cjs',
      name: 'cjs',
      dir: 'cjs',
    },
  ],
  external: ['svelte'],
  plugins: [
    babel({
      exclude: 'node_modules/**',
    }),
  ],
  watch: {
    clearScreen: false,
  },
}
