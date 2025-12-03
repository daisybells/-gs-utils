/**
 * Collapses white space characters into a single space.
 * @param {String} string
 * @returns {String}
 */
function clearWhiteSpace(string = "") {
    return string.replaceAll(/[\t\n\v\f\r\s]{2,}/gu, " ").trim();
}
export { clearWhiteSpace };
