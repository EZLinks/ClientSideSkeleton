
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
    },
    {
        string: 'module',
        errorMessage: 'no module entered. Use --module to attach the component to a module'
    }
];

/**
 * Retrieve and manipulate the task arguments.
 *
 * @return {Object} - An object containing the task options.
 */
function getOptions() {

    const options = utils.getArgs('createComponent', knownArgs);
    options.nameCap = utils.capitalizeFirstLetter(options.name);
    options.nameHyphenated = utils.hyphenateName(options.name);
    options.controllerAs = utils.controllerAs(options.name);
    options.moduleCap = utils.capitalizeFirstLetter(options.module);
    options.modulePath = './src/modules/'.concat(options.module, '/', options.module, '.ts');
    options.targetLocation = './src/modules/'.concat(options.module, '/components/', options.name);

    return options;
}

/**
 * Build and return the component import string to inject into the module file.
 *
 * @param  {Object} options - The task options.
 * @returns {string} The component import string to inject into the module file.
 */
function getImportString(options) {
    return String.prototype.concat('import {', options.nameCap, '} from \'modules/', options.module, '/components/', options.name, '/', options.name, '\'');
}

/**
 * Find the last import in the module file then inject import statement of the
 * new component into the file content and return the result.
 *
 * @param  {string} content - The file content.
 * @param  {Object} options - The task options.
 * @returns {string} The (possibly edited) file content.
 */
function addImport(content, options) {
    const lineIndex = content.lastIndexOf('import ');
    if (lineIndex > -1) {
        const sliceIndex = content.indexOf(';', lineIndex);
        const importStr = getImportString(options);

        return String.prototype.concat(content.slice(0, sliceIndex + 1), '\r\n', importStr, content.slice(sliceIndex, content.length));
    }
    console.error(String.prototype.concat('Unable to inject the ', options.name, ' component import into the ', options.module, ' module.'));
    return content;
}

/**
 * Build and return the component definition string to inject into the module file.
 *
 * @param  {string} tab - The tab length on the existing component definitions
 *  in the module file. Used to match the tab length of the new component with
 *  the existing components.
 * @param  {Object} options - The task options.
 * @returns {string} The component definition string to inject into the module file.
 */
function getComponentString(tab, options) {
    return String.prototype.concat(tab,'.component(\'', options.name, '\', new ', options.nameCap, '())');
}

/**
 * Find the last component definition in the module file then inject definition
 * of the new component into the file content and return the result.
 *
 * @param  {string} content - The file content.
 * @param  {Object} options - The task options.
 * @returns {string} The (possibly edited) file content.
 */
function addComponent(content, options) {
    // Find the last component definition on the module.
    const re = /^((\s*)\.component\(\'(\w+)\', [\w\s\(\)]+\))$/gm;

    // Insert the component definition at least after the module component
    // definition (the first component definition).
    var result = re.exec(content);
    var temp;

    // Alphabetise!
    while ((temp = re.exec(content)) !== null) {
        if (options.name < temp[3]) {
            break;
        }
        result = temp;
    }

    if (result && result.index > -1) {
        // Either the last component definition is the last definition on the module or not. Act accordingly.
        const sliceIndex = Math.min(content.indexOf(';', result.index), content.indexOf('\r\n', result.index));
        const componentStr = getComponentString(result[2], options);

        // NOTE: Somehow only a \r is needed here.. \r\n adds an extra line feed.
        return String.prototype.concat(content.slice(0, sliceIndex), '\r', componentStr, content.slice(sliceIndex));
    }
    console.error(String.prototype.concat('Unable to inject the ', options.name, ' component definition into the ', options.module, ' module.'));
    return content;
}

// Create a new component. Sets up its ts, spec.ts, html and scss files.
// Adds the component to the specified module.
gulp.task('createModalComponent', () => {

    throw new Error('Not yet implemented (correctly). DO NOT USE');

    const options = getOptions();

    // Create the ts file
    gulp.src('./templates/modalComponent.ts.tmpl')
        .pipe(template(options))
        .pipe(rename(options.name.concat('.ts')))
        .pipe(gulp.dest(options.targetLocation));

    // Create the test spec file
    gulp.src('./templates/spec.ts.tmpl')
        .pipe(template(options))
        .pipe(rename(options.name.concat('.spec.ts')))
        .pipe(gulp.dest(options.targetLocation));


    // Create the html file
    gulp.src('./templates/modalComponent.html.tmpl')
        .pipe(template(options))
        .pipe(rename(options.name.concat('.html')))
        .pipe(gulp.dest(options.targetLocation));

    // Create the sass file
    file(options.name.concat('.scss'), options.nameHyphenated.concat('\n{\n\n}'), { src: true })
        .pipe(gulp.dest(options.targetLocation));

    /**
     * Edit the module file, injecting the import and definition of the  new component.
     *
     * @param  {string} content - The file content.
     * @param  {Function} done - Async callback function.
     */
    function editModule(content, done) {
        content = addImport(content, options);
        content = addComponent(content, options);
        done(null, content);
    }

    // Add component to module.
    // The gulp.dest overwrite option doesn't actually work. Use base.
    // See: https://github.com/gulpjs/gulp/issues/267#issuecomment-199056805
    gulp.src(options.modulePath, { base: './' })
        .pipe(change(editModule))
        .pipe(gulp.dest('./'));
});
