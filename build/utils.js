
const gulputil = require('gulp-util');
const minimist = require('minimist');

/**
 * Retrieve the specified task arguments.
 *
 * @param  {string} taskName - The name of the task.
 * @param  {Object} knownArgs - The expected arguments.
 * @returns {Object} - An object containing the found arguments.
 */
function getArgs(taskName, knownArgs) {
    const args = minimist(process.argv.slice(2), knownArgs);

    knownArgs.forEach(function(arg) {
        if(!args[arg.string]){
            throw new gulputil.PluginError(taskName, arg.errorMessage);
        }
    }, this);

    return args;
}

/**
 * Hyphenate the string - replacing a capital letter with a hyphen and lowercase.
 *
 * @param  {string} string - The string to transform.
 * @returns {string} - The transformed string.
 */
function hyphenateName(string) {
    return string.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

/**
 * Capitalize the first letter of a string.
 *
 * @param {string} string The string to transform.
 * @returns {string} A string with the first letter capitalized.
 */
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Change the first letter to lower case.
 *
 * @param {string} string The string to transform.
 * @returns {String} A string with the first letter change to it's lower case version.
 */
function lowerFirstLetter(string) {
    return string.charAt(0).toLowerCase() + string.slice(1);
}

/**
 * Is character uppercase?
 *
 * @param  {char} ch - The character to check.
 * @returns {boolean} - Is the character uppercase?
 */
function isUpperCase(ch) {
    return (ch >= 'A') && (ch <= 'Z');
}

/**
 * Generate the controllerAs for the component.
 *
 * @param  {string} componentName - The component name.
 * @returns {string} - The controllerAs for the component.
 */
function controllerAs(componentName) {
	return String.prototype.concat(componentName[0], componentName.split('').filter(isUpperCase).join('')).toLowerCase();
}

module.exports = {
    getArgs: getArgs,
    hyphenateName: hyphenateName,
    capitalizeFirstLetter: capitalizeFirstLetter,
    lowerFirstLetter: lowerFirstLetter,
    controllerAs: controllerAs
};
