
var webpack = require('webpack');

module.exports = {
    entry: require('./common/entry'),
    output: require('./common/output'),
    resolve: require('./common/resolve'),
    resolveLoader: {
        modulesDirectories: ["node_modules"]
    },
    devtool: 'source-map',
    tslint: require('../custom_loaders/tslint/tslint'),
    plugins: require('./common/plugins').concat([
        new webpack.optimize.UglifyJsPlugin({
            warning: false,
            mangle: false,
            comments: false
        })
    ]),
    loader: {
        appSettings: {
            env: 'production'
        }
    },
    module: {
        preLoaders: require('./common/preloaders'),
        loaders: require("./common/loaders")
    }
};
