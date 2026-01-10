/**
 * Replace templates from an unknown string using a replacer object.
 * @param {String} inputString
 * @param {Object<string, string>} replacer
 * @returns {String}
 */
function replaceTemplate(inputString, replacer) {
    return inputString.replaceAll(
        /(\\){0,1}\$\{(.*?)\}/gu,
        (match, isEscaped, key) => {
            if (isEscaped) return match;
            const replacerExists = replacer.hasOwnProperty(key);
            if (!replacerExists) return "";
            return replacer[key];
        }
    );
}

export { replaceTemplate };
