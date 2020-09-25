const path = require("path");

const config = {
  target: "web",
  entry: {
    main: "./src/index.js",
  },
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "alpaca-toolkit-cdn.js",
    library: "alpaca",
    libraryTarget: "window",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              [
                "@babel/preset-env",
                {
                  targets: "> 0.25%, not dead",
                },
              ],
            ],
          },
        },
      },
    ],
  },
  plugins: [],
  devServer: {
    contentBase: path.join(__dirname, "public"),
    compress: true,
    port: 9000,
  },
  mode: "production",
};

module.exports = config;
