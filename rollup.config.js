import resolve from 'rollup-plugin-node-resolve'
import visualizer from 'rollup-plugin-visualizer'

export default {
  input: 'src/index.js',
  output: {
    sourcemap: true,
    format: 'esm',
    name: 'app',
    dir: 'dist'
  },
  plugins: [
    resolve({
      only: ['tslib', 'rxjs', 'rxjs/operators']
    }),
    visualizer({
      filename: 'dist/stats.html'
    })
  ],
  watch: {
    clearScreen: false
  }
}
