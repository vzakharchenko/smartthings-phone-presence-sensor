const webpack = require('webpack');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
const VersionFile = require('webpack-version-file-plugin');
// const Dotenv = require('dotenv-webpack');

const env = process.env.NODE_ENV === 'production' ? 'production' : 'development';

const config = {
  mode: env,
  entry: {
    wifiPresenceHandler: './src/wifiPresence.js'
  },
  target: 'node',
  node: {
    __dirname: false,
  },
  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname, '.webpack'),
    filename: '[name]/[name].js',
  },
  module: {
    rules: [{
      test: /\.(js|jsx)$/,
      use: ['babel-loader'],
    },
    ],
  },
  plugins: [
    new ProgressBarPlugin(),
    new webpack.DefinePlugin({
      '.': '__dirname',
    }),
    new VersionFile({
      packageFile: path.join(__dirname, 'package.json'),
      template: path.join(__dirname, 'version.ejs'),
      outputFile: path.join(__dirname, './resources/version.json'),
    }),
  ],
  resolve: {
    modules: [
      path.join(__dirname, 'src'),
      path.join(__dirname, '.'),
      'node_modules',
    ],
  },
  stats: {
    colors: true,
  },
  devtool: env === 'development' ? 'source-map' : 'nosources-source-map',
};

Object.keys(config.entry).forEach((entry) => {
  config.plugins.push(new CopyWebpackPlugin({
    patterns: [
      {
        from: './resources',
        to: `./${entry}`,
      },
    ],
  }));
});

module.exports = config;
