// rollup.config.js
import fs from 'fs';
import path from 'path';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import json from 'rollup-plugin-json';
import uglify from 'rollup-plugin-uglify';
import UglifyJS from 'uglify-es';

const pkg = JSON.parse(fs.readFileSync(path.resolve('./package.json'), 'utf-8'));
const external = Object.keys(pkg.dependencies || {}).concat(Object.keys(pkg.peerDependencies || {}))

export default {
  input: 'src/index.js',
  output: [
    {
      file: 'dist/alpaca-toolkit.min.js',
      format: 'cjs',
      exports: 'named',
    },
    {
      file: 'dist/alpaca-toolkit.es6.min.js',
      format: 'es',
      exports: 'named',
    }
  ],

  plugins: [
    json({
      preferConst: true,
    }),

    nodeResolve({
      jsnext: true,
      preferBuiltins: false,
      main: true
    }),

    commonjs({
      exclude: [ '/node_modules/'],
      sourceMap: false,  // Default: true
    }),

    uglify({}, UglifyJS.minify),

  ],
  external
};
