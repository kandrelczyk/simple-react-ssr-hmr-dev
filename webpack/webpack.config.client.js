const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const config = require('./webpack.config.base');
const findConfig = require('./utils');

let client = findConfig(config, 'client');

client = {
  ...client,
  mode: 'development',
  devtool: 'inline-source-map',
  plugins: [
    ...client.plugins,
    new HtmlWebpackPlugin({
      template: 'src/client/index.html',
      filename: 'index.html',
      inject: 'body',
    }),
    new webpack.HotModuleReplacementPlugin(),
    new CleanWebpackPlugin(),
  ],
  devServer: {
    host: 'localhost',
    port: 3001,
    historyApiFallback: true,
    hot: true,
    contentBase: './public',
  },
};

module.exports = client;
