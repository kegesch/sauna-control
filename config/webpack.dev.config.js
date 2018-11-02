const { spawn } = require('child_process');
const webpack = require('webpack');
const merge = require('webpack-merge');
const path = require('path');

const baseConfig = require('./webpack.base.config');
const build = path.resolve(__dirname, '../build');

const config = {
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    })
  ],
  resolve: {
    alias: {
      'i2c-bus': path.resolve(__dirname, '../mocks/i2c-bus-mock.ts'),
      'rpi-ws2801': path.resolve(__dirname, '../mocks/rpi-ws2801-mock.ts'),
      'onoff': path.resolve(__dirname, '../mocks/onoff-mock.ts')
    }
  },
  devtool: 'cheap-source-map',
  devServer: {
    contentBase: build,
    stats: {
      colors: true,
      chunks: false,
      children: false
    },
    before() {
      spawn(
        'electron',
        ['.'],
        { shell: true, env: process.env, stdio: 'inherit' }
      )
        .on('close', code => process.exit(0))
        .on('error', spawnError => console.error(spawnError))
    }
  }
};

module.exports = merge(baseConfig, config);

