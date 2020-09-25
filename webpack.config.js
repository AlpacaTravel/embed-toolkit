const path = require("path");

const config = [
  {
    target: "web",
    entry: {
      "alpaca-toolkit": ["@babel/polyfill", "./src/index.ts"],
    },
    output: {
      path: path.resolve(__dirname, "./dist"),
      filename: "[name].js",
      library: "alpaca",
      libraryTarget: "window",
    },
    module: {
      rules: [
        {
          test: /\.[jt]s$/,
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
                "@babel/preset-typescript",
              ],
            },
          },
        },
      ],
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
    },
    plugins: [],
    devServer: {
      contentBase: path.join(__dirname, "public"),
      compress: true,
      port: 9000,
    },
    mode: "production",
  },
  {
    target: "web",
    entry: {
      "alpaca-widget": ["@babel/polyfill", "./src/widget.ts"],
    },
    output: {
      path: path.resolve(__dirname, "./dist"),
      filename: "[name].js",
    },
    module: {
      rules: [
        {
          test: /\.[jt]s$/,
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
                "@babel/preset-typescript",
              ],
            },
          },
        },
      ],
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
    },
    plugins: [],
    devServer: {
      contentBase: path.join(__dirname, "public"),
      compress: true,
      port: 9000,
    },
    mode: "production",
  },
];

module.exports = config;
