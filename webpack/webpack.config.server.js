const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const config = require('./webpack.config.base');
const findConfig = require('./utils');

const server = findConfig(config, 'server');
server.plugins = [
  ...server.plugins,
 // new CleanWebpackPlugin(),
];

server.mode = 'development';

module.exports = server;
