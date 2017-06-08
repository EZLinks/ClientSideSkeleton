
var webpack = require('webpack');

var CopyWebpackPlugin = require('copy-webpack-plugin');
var CopyPlugin = require('./plugins/copyPlugin');

module.exports = [
    new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery',
        'window.jquery': 'jquery'
    }),
    new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        minChuncks: Infinity
    }),
    new CopyWebpackPlugin([
            // copy all localization files to server
            { context: 'src/locale', from: '**/*.json', to: 'locale' },
    ]),
    new CopyPlugin()
];
