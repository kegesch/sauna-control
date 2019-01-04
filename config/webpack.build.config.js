const webpack = require("webpack");
const merge = require("webpack-merge");
const MinifyPlugin = require("babel-minify-webpack-plugin");
const fs = require("fs");
const path = require("path");

const baseConfig = require("./webpack.base.config");

var nodeModules = {};
fs.readdirSync(path.resolve("node_modules"))
  .filter(function(x) {
    return [".bin"].indexOf(x) === -1;
  })
  .forEach(function(mod) {
    nodeModules[mod] = "commonjs " + mod;
  });

const config = {
  plugins: [
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("production")
    })
  ],
  externals: nodeModules
};

module.exports = merge(baseConfig, config);
