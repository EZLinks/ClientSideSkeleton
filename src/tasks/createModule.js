
const gulp = require('gulp');
const change = require('gulp-change');
const file = require('gulp-file');
const rename = require('gulp-rename');
const template = require('gulp-template');

const utils = require('../utils');

const knownArgs = [
    {
        string: 'name',
        errorMessage: 'no name entered. Use --name to give the component a name'
    }
];

/**
 * Retrieve and manipulate the task arguments.
 *
 * @return {Object} - An object containing the task options.
 */
function getOptions() {
    var options = utils.getArgs('createModule', knownArgs);
    options.nameCap = utils.capitalizeFirstLetter(options.name);
    options.targetLocation = './src/modules/'.concat(options.name);
    options.indexLocation = './src/index.ts';
    options.entryLocation = './webpack/common/entry.json';

    return options;
}

/**
 * Build and return the module definition string to inject into the index.ts file.
 *
 * @param  {Object} options - The task options.
 * @returns {string} The module definition string to inject into the index.ts file.
 */
function getModuleString(options) {
    return String.prototype.concat(', \'360.', options.nameCap, '\'');
}

/**
 * Find the getModules function in index.ts then inject definition of module
 * into the list of application modules.
 *
 * @param  {string} content - The index.ts file content.
 * @param  {Object} options - The task options.
 * @returns {string} The (possibly edited) file content.
 */
function addModule(content, options) {
    const fnIndex = content.indexOf('function getModules');
    if (fnIndex > -1) {
        const sliceIndex = content.indexOf(']', fnIndex);
        return String.prototype.concat(content.slice(0, sliceIndex), getModuleString(options), content.slice(sliceIndex, content.length));
    }
    console.error(String.prototype.concat('Unable to inject the ', options.name, ' module definition into index.ts.'));
    return content;
}

/**
 * Load the entry.json content, convert to a JSON object, add the new module
 * entry, then stringify and return.
 *
 * @param  {string} content - The file content.
 * @param  {Object} options - The task options.
 * @returns {string} The (possibly edited) file content.
 */
function addEntry(content, options) {
    var entries = JSON.parse(content);
    if (entries[options.name] === undefined) {
        entries[options.name] = [String.prototype.concat(options.targetLocation, '.ts')];
    }
    return JSON.stringify(entries, null, '  ');
}

// Create a new module.
gulp.task('createModule', () => {

    const options = getOptions();

    // Create the ts file
    gulp.src('./templates/module.ts.tmpl')
        .pipe(template(options))
        .pipe(rename(options.name.concat('.ts')))
        .pipe(gulp.dest(options.targetLocation));

    // Create the html file
    file(options.name.concat('.html'), '', { src: true })
    .pipe(gulp.dest(options.targetLocation));

    /**
     * Edit the index file, injecting the module definition into the list of
     * application modules.
     *
     * @param  {string} content - The file content.
     * @param  {Function} done - Async callback function.
     */
    function editIndex(content, done) {
        content = addModule(content, options);
        done(null, content);
    }

    /**
     * Edit the entry.json file, injecting the module location into the list
     * of modules loaded by webpack.
     *
     * @param  {string} content - The file content.
     * @param  {Function} done - Async callback function.
     */
    function editEntry(content, done) {
        done(null, addEntry(content, options));
    }

    // Add component to module.
    // The gulp.dest overwrite option doesn't actually work. Use base.
    // See: https://github.com/gulpjs/gulp/issues/267#issuecomment-199056805
    gulp.src(options.indexLocation, { base: './' })
        .pipe(change(editIndex))
        .pipe(gulp.dest('./'));

    gulp.src(options.entryLocation, { base: './' })
        .pipe(change(editEntry))
        .pipe(gulp.dest('./'));
});
