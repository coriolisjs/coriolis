import resolve from 'rollup-plugin-node-resolve'
import visualizer from 'rollup-plugin-visualizer'
// import livereload from 'rollup-plugin-livereload'
// import { terser } from 'rollup-plugin-terser'

// const production = !process.env.ROLLUP_WATCH

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
