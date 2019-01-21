const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ElectronNativePlugin = require("electron-native-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');

// Any directories you will be adding code/files into, need to be added to this array so webpack will pick them up
const defaultInclude = [
  path.resolve(__dirname, "../src"),
  path.resolve(__dirname, "../mocks"),
  path.resolve(__dirname, "../node_modules/node-id3")
];
const build = path.resolve(__dirname, "../build");

module.exports = {
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [{ loader: "babel-loader" }],
        include: defaultInclude
      },
      {
        test: /\.js$/,
        use: [
          "electron-native-patch-loader",
          {
            loader: "electron-native-loader",
            options: {
              outputPath: build
            }
          },
          "source-map-loader"
        ],
        enforce: "pre"
      },
      {
        test: /\.node$/,
        use: "electron-native-loader"
      },
      {
        test: /node_modules[\/\\](iconv-lite)[\/\\].+/,
        resolve: {
          aliasFields: ['main']
        }
      }
    ]
  },
  output: {
    path: build,
    filename: "[name].js"
  },
  resolve: {
    extensions: [".js", ".ts", ".tsx", ".jsx", ".json"]
  },
  node: {
    __dirname: false,
    __filename: false
  },
  target: "electron-renderer",
  plugins: [
    new HtmlWebpackPlugin(),
    new ElectronNativePlugin({
      forceRebuild: false,
      optionalDependencies: true
    }),
    new CopyWebpackPlugin([
      { from: 'assets/music' }
    ])
  ],
  stats: {
    colors: true,
    children: false,
    chunks: false,
    modules: false
  },
  externals: {
    bindings: 'require("bindings")'
  }
};
