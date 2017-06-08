// NOTE: This data can't be stored as JSON as it
// requires the __dirname node global object.

module.exports = {
    root: __dirname,
    extensions: ['', '.ts', '.js', '.json'],
    modulesDirectories: ["node_modules", 'src', 'src/modules']
};
