
var fs = require('fs-extra');

var LiveReloadPlugin = require('webpack-livereload-plugin');

var plugins = require('./common/plugins');

if (fs.existsSync('./webpack/https/cert.pfx')) {
    plugins.push(new LiveReloadPlugin({
        pfx: fs.readFileSync('./webpack/https/cert.pfx'),
        passphrase: 'password'
    }));
}

module.exports = {
    entry: require('./common/entry'),
    output: require('./common/output'),
    resolve: require('./common/resolve'),
    resolveLoader: {
        modulesDirectories: ["node_modules"]
    },
    devtool: "inline-eval-cheap-source-map",
    tslint: require('../custom_loaders/tslint/tslint'),
    plugins: plugins,
    loader: {
        appSettings: {
            env: 'development'
        }
    },
    module:{
        preLoaders: require('./common/preloaders'),
        loaders: require("./common/loaders")
    }
};
