/**
 * Normalizes strings, ideal for comparisons
 * @param {string} string - String to normalize.
 * @param {object} inputOptions - Configurable options for the function.
 * @param {Boolean} [inputOptions.preserveSpaces = true] - Collapse spaces to nothing or preserve
 * spacing from the initial string.
 * @param {Boolean} [inputOptions.collapseWhiteSpace = false] - Collapse strings of multiple spaces into a
 * single space character or preserve strings with consecutive space characters.
 * @param {string} [inputOptions.spaceCharacter = "-"] - Character to replace spaces with.
 * @returns {string} - Normalized string.
 */
function normalizeString(string, inputOptions) {
    const defaultOptions = {
        preserveSpaces: true,
        collapseWhiteSpace: false,
        spaceCharacter: "-",
    };
    const {
        preserveSpaces,
        collapseWhiteSpace: collapse,
        spaceCharacter,
    } = {
        ...defaultOptions,
        ...inputOptions,
    };
    const spaceReplacement = preserveSpaces ? spaceCharacter : "";
    const stringToEdit = collapse ? clearWhiteSpace(string) : string;
    return stringToEdit
        .trim()
        .toLowerCase()
        .replaceAll(/[^\w\d ]/gu, "")
        .replaceAll(/ /gu, spaceReplacement);
}

function capitalizeWords(string) {
    return string.replaceAll(/\b\w(?!\s)/giu, (letter) => letter.toUpperCase());
}

function clearWhiteSpace(htmlString = "") {
    const specialWhiteSpaceCharacters = /[\t\n\v\f\r]+/gu;
    const stringWithoutSpecialSpaces = htmlString.replaceAll(
        specialWhiteSpaceCharacters,
        ""
    );
    const collapsedString = stringWithoutSpecialSpaces
        .replaceAll(/  +/gu, " ")
        .trim();
    return collapsedString;
}

function clearRegex(string) {
    return string.replaceAll(/[.*+?^${}()|[\]\\]/gu, "\\$&");
}

export { normalizeString, capitalizeWords, clearWhiteSpace, clearRegex };
export { latinize } from "./latinize.js";
