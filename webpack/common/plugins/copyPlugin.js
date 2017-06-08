
var fs = require('fs-extra');

function CopyPlugin(options) {

}

CopyPlugin.prototype.apply = function (compiler) {
    compiler.plugin('done', function (compilation, callback) {
        fs.copySync('dist', '../scripts/dist');
    });
}

module.exports = CopyPlugin;
