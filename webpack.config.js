const path = require("path");
const bundlePath = path.resolve(__dirname, "dist/");

const webpack = require('webpack');
const dotenv = require('dotenv');

const env = dotenv.config().parsed;
const envKeys = Object.keys(env).reduce((prev, next) => {
  prev[`process.env.${next}`] = JSON.stringify(env[next]);
  return prev;
}, {});

module.exports = {
  entry: ["@babel/polyfill","./src/index.js"],
  output: {
    path: bundlePath,
    filename: "bundle.js"
  },
  devServer: {
      inline: true,
      contentBase: './dist',
      port: 3000
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: [ "babel-loader" ],
      },
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      },
      {
        test: /\.html$/,
        loader: [ "html-loader" ]
      },
      {
        test: /\.svg$/,
        loader: 'svg-inline-loader'
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin(envKeys),
    new webpack.HotModuleReplacementPlugin()
  ]
};
