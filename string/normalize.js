/**
 * Normalizes strings, ideal for comparisons
 * @param {String} string - String to normalize.
 * @param {object} inputOptions - Configurable options for the function.
 * @param {Boolean} [inputOptions.preserveSpaces = true] - Collapse spaces to nothing or preserve
 * spacing from the initial string.
 * @param {Boolean} [inputOptions.collapseWhiteSpace = false] - Collapse strings of multiple spaces into a
 * single space character or preserve strings with consecutive space characters.
 * @param {String} [inputOptions.spaceCharacter = "-"] - Character to replace spaces with.
 * @returns {String} - Normalized string.
 */
function normalizeString(string, inputOptions) {
    const defaultOptions = {
        preserveSpaces: true,
        collapseWhiteSpace: true,
        spaceCharacter: "-",
    };
    const { preserveSpaces, collapseWhiteSpace, spaceCharacter } = {
        ...defaultOptions,
        ...inputOptions,
    };
    const clearedSpaceCharacter = clearRegex(spaceCharacter);

    const replacedString = string.replaceAll(
        /[^\d\w]/gmu,
        preserveSpaces ? spaceCharacter : ""
    );

    if (!collapseWhiteSpace || !preserveSpaces) return replacedString;

    const collapseRegexString = `${clearedSpaceCharacter}{2,}`;
    const collapseRegex = new RegExp(collapseRegexString, "gu");

    return replacedString.replaceAll(collapseRegex, spaceCharacter);
}

/**
 * Replace all REGEX special characters with their escaped counterparts
 * @param {String} string
 * @returns {String}
 */
function clearRegex(string) {
    return string.replaceAll(/[.*+?^${}()|[\]\\]/gu, "\\$&");
}

export { normalizeString, clearRegex };
