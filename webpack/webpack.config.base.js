const webpack = require('webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const LoadablePlugin = require('@loadable/webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

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
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: process.env.NODE_ENV === 'development',
              publicPath: 'css',
            },
          },
          'css-loader',
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  plugins: [
    new webpack.ProgressPlugin(),
    new LoadablePlugin(),
    new MiniCssExtractPlugin({
      moduleFilename: ({ name }) => `css/${name}.css`,
    })],
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
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  plugins: [
    new webpack.ProgressPlugin(),
    new MiniCssExtractPlugin({
      moduleFilename: ({name}) => `public/css/${name}.css`,
    })],
  output: { path: path.join(__dirname, '../build'), filename: 'server.js' },
};

module.exports = [client, server];
