const path = require('path');

const config = require('./webpack.config.base');
const findConfig = require('./utils');

const client = findConfig(config, 'client');
client.mode = 'production';
client.output = {
    path: path.join(__dirname, '../build/public'),
    publicPath: '',
    filename: 'client.js',
};
const server = findConfig(config, 'server');
server.mode = 'production';

module.exports = [client, server];
