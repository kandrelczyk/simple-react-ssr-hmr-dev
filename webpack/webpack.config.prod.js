const config = require('./webpack.config.base');
const findConfig = require('./utils');


const client = findConfig(config, 'client');
client.mode = 'production';

const server = findConfig(config, 'server');
server.mode = 'production';

module.exports = [client, server];
