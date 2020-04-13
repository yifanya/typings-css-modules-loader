const path = require("path");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  entry: "./src/index.ts",
  output: {
    filename: "main.js",
    path: path.join(__dirname, "./dist"),
  },
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: "babel-loader",
          },
          {
            loader: "ts-loader",
            options: {
              transpileOnly: true,
            }
          }
        ]
      },
      {
        oneOf: [
          {
            test: /\.m\.css$/,
            use: [
              "style-loader",
              path.join(__dirname, "../src/log-loader"),
              {
                loader: path.join(__dirname, "../src/typings-css-module-loader"),
                options: {
                  modules: true
                }
              },
            ]
          },
          {
            test: /\.css$/,
            use: [
              "style-loader",
              path.join(__dirname, "../src/log-loader"),
              path.join(__dirname, "../src/typings-css-module-loader")
            ]
          },
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "./public/index.html")
    })
  ]
}