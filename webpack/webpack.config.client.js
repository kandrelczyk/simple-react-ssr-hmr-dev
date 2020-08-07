const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

const config = require('./webpack.config.base');
const findConfig = require('./utils');

let client = findConfig(config, 'client');

client = {
  ...client,
  mode: 'development',
  devtool: 'inline-source-map',
  plugins: [
    ...client.plugins,
    new webpack.HotModuleReplacementPlugin(),
    new CleanWebpackPlugin(),
  ],
  output: {
    path: path.join(__dirname, '../build-client/'),
    publicPath: '',
    filename: 'client.js',
  },
};

module.exports = client;
