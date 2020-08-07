const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = require('./webpack.config.base');
const findConfig = require('./utils');

let client = findConfig(config, 'client');

client = {
  ...client,
  plugins: [
    ...client.plugins,
    new HtmlWebpackPlugin({
      template: 'src/client/index.html',
      filename: 'index.html',
      inject: 'body',
    }),
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
