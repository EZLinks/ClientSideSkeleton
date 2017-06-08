
const gulp = require('gulp');
const change = require('gulp-change');
const template = require('gulp-template');
const rename = require('gulp-rename');

const utils = require('../utils');

const knownArgs = [
    {
        string: 'name',
        errorMessage: 'no name entered. Use --name to give the servic a name'
    },
    {
        string: 'module',
        errorMessage: 'no module entered. Use --module to attach the service to a module'
    }
];

/**
 * Retrieve and manipulate the task arguments.
 *
 * @return {Object} - An object containing the task options.
 */
function getOptions() {
    var options = utils.getArgs('createService', knownArgs);
    options.nameCap = utils.capitalizeFirstLetter(options.name);
    options.moduleCap = utils.capitalizeFirstLetter(options.module);
    options.targetLocation = String.prototype.concat('./src/modules/', options.module, '/services/');
    options.modulePath = String.prototype.concat('./src/modules/', options.module, '/', options.module, '.ts');

    return options;
}

function getImportString(options) {
    return String.prototype.concat('import {', options.nameCap, '} from \'./services/', options.name, '\'');
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
    console.error(String.prototype.concat('Unable to inject the ', options.name, ' service import into the ', options.module, ' module.'));
    return content;
}

/**
 * Build and return the service definition string to inject into the module file.
 *
 * @param  {string} tab - The tab length on the existing service definitions
 *  in the module file. Used to match the tab length of the new service with
 *  the existing services.
 * @param  {Object} options - The task options.
 * @returns {string} The service definition string to inject into the module file.
 */
function getServiceString(tab, options) {
    return String.prototype.concat(tab,'.service(\'', options.name, '\', ', options.nameCap, ')');
}

/**
 * Find the last service definition in the module file then inject definition
 * of the new service into the file content and return the result.
 * TODO: Add ability to add service definition that alphabetically precedes
 * existing service definitions.
 *
 * @param  {string} content - The file content.
 * @param  {Object} options - The task options.
 * @returns {string} The (possibly edited) file content.
 */
function addService(content, options) {
    // Find the last service definition on the module.
    const re = /^((\s*)\.service\(\'(\w+)\', [\w\s]+\))$/gm;

    var result;
    var temp;

    // Alphabetise!
    while ((temp = re.exec(content)) !== null) {
        if (options.name < temp[3]) {
            break;
        }
        result = temp;
    }

    if (result && result.index > -1) {
        // Either the last service definition is the last definition on the module or not. Act accordingly.
        const sliceIndex = Math.min(content.indexOf(';', result.index), content.indexOf('\r\n', result.index));
        const componentStr = getServiceString(result[2], options);

        // NOTE: Somehow only a \r is needed here.. \r\n adds an extra line feed.
        return String.prototype.concat(content.slice(0, sliceIndex), '\r', componentStr, content.slice(sliceIndex));
    }
    console.error(String.prototype.concat('Unable to inject the ', options.name, ' service definition into the ', options.module, ' module.'));
    return content;
}

// Create a new service.
gulp.task('createService', () => {

    const options = getOptions();

    // Create the ts file
    gulp.src('./templates/service.ts.tmpl')
        .pipe(template(options))
        .pipe(rename(options.name.concat('.ts')))
        .pipe(gulp.dest(options.targetLocation));

    /**
     * Edit the module file, injecting the import and definition of the  new service.
     *
     * @param  {string} content - The file content.
     * @param  {Function} done - Async callback function.
     */
    function editModule(content, done) {
        content = addImport(content, options);
        content = addService(content, options);
        done(null, content);
    }

    // Add service to module.
    // The gulp.dest overwrite option doesn't actually work. Use base.
    // See: https://github.com/gulpjs/gulp/issues/267#issuecomment-199056805
    gulp.src(options.modulePath, { base: './' })
        .pipe(change(editModule))
        .pipe(gulp.dest('./'));
});
