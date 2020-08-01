const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

const client = {
  name: 'client',
  entry: ['./src/client/client.js'],
  target: 'web',
  module: {
    rules: [
      {
        test: /\.js?$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  output: {
    path: path.join(__dirname, '../build'),
    publicPath: '',
    filename: 'public/client.js',
  },
};

const server = {
  entry: ['./src/server/index'],
  name: 'server',
  target: 'node',
  externals: [nodeExternals({ whitelist: ['webpack/hot/poll?1000'] })],
  module: {
    rules: [{ test: /\.js?$/, use: 'babel-loader', exclude: /node_modules/ }],
  },
  plugins: [new webpack.ProgressPlugin()],
  output: { path: path.join(__dirname, '../build'), filename: 'server.js' },
};

module.exports = [client, server];
