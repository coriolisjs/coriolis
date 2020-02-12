import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import visualizer from 'rollup-plugin-visualizer'

export default {
  input: 'src/index.js',
  output: [
    {
      sourcemap: true,
      format: 'esm',
      name: 'coriolis-esm',
      dir: 'dist/esm'
    },
    {
      sourcemap: true,
      format: 'cjs',
      name: 'coriolis-cjs',
      dir: 'dist/cjs'
    }
  ],
  plugins: [
    babel({
      exclude: 'node_modules/**'
    }),
    resolve({
      only: ['tslib', 'rxjs', 'rxjs/operators']
    }),
    visualizer({
      filename: 'dist/stats.html',
      bundlesRelative: true
    })
  ],
  watch: {
    clearScreen: false
  }
}
