
var webpack = require('webpack');

module.exports = {
  entry: require('./common/entry'),
  output: require('./common/output'),
  resolve: require('./common/resolve'),
  resolveLoader: {
    modulesDirectories: ["node_modules"]
  },
  devtool: 'inline-source-map',
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      'window.jquery': 'jquery'
    })
  ],
  module: {
    loaders: require("./common/loaders"),
    postLoaders: [
      {
        test: /^((?!\.spec\.ts).)*.ts$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'istanbul-instrumenter'
      }
    ]
  },
  tslint: {
      emitErrors: true,
      failOnHint: true
  }
};
