const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const LoadablePlugin = require('@loadable/webpack-plugin')

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
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  plugins: [new webpack.ProgressPlugin(), new LoadablePlugin()],
  output: {
    path: path.join(__dirname, '../build/public'),
    publicPath: '',
    filename: 'client.js',
  },
};

const server = {
  entry: ['./src/server/index'],
  name: 'server',
  target: 'node',
  externals: [nodeExternals({whitelist: ['webpack/hot/poll?1000']})],
  module: {
    rules: [
      {test: /\.js?$/, use: 'babel-loader', exclude: /node_modules/},
      {
        test: /\.css$/i,
        loader: 'css-loader',
        options: {
          modules: {
            exportOnlyLocals: true,
          },
        },
      },],
  },
  plugins: [new webpack.ProgressPlugin()],
  output: { path: path.join(__dirname, '../build'), filename: 'server.js' },
};

module.exports = [client, server];
