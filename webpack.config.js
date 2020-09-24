const path = require('path');
const BabelMinifyWebpackPlugin = require('babel-minify-webpack-plugin');

const config = {
  entry: {
    'alpaca-toolkit.babel.min': [path.resolve(__dirname, './src/index.js')],
    'alpaca-toolkit.babel.polyfilled': ['babel-polyfill', path.resolve(__dirname, './src/index.js')],
    'alpaca-toolkit.babel.polyfilled.min': ['babel-polyfill', path.resolve(__dirname, './src/index.js')],
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].js',
    library: 'alpaca',
    libraryTarget: 'window',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                "env", 
                {
                  "targets": {
                    "browsers": [
                      ">0.25%"
                    ]
                  }
                }
              ]
            ]
          }
        }
      }
    ]
  },
  plugins: [
    new BabelMinifyWebpackPlugin({}, { include: /\.min\.js$/ }),
  ],
  devServer: {
    contentBase: path.join(__dirname, 'public'),
    compress: true,
    port: 9000
  }
}

module.exports = config;
