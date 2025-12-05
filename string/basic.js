/**
 * Capitalizes every letter within a string.
 * @param {String} string
 * @returns {String}
 */
function capitalize(string) {
    return string.replaceAll(/\b\w(?!\s)/giu, (letter) => letter.toUpperCase());
}

/**
 * Truncates an input string to not exceed a specified maxLength
 * @param {String} string
 * @param {Number} maxLength
 * @param {{indicator?: String}} [inputOptions]
 * @returns {String}
 */
function truncate(string, maxLength, inputOptions = {}) {
    const { indicator } = { indicator: "...", ...inputOptions };

    if (string.length <= maxLength) {
        return string;
    }
    const slicedString = string
        .slice(0, maxLength - indicator.length)
        .replace(/\s$/u, "");

    return `${slicedString}${indicator}`;
}

export { capitalize, truncate };
