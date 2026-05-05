/**
 * Capitalize the first letter of every word.
 * @param string
 * @returns
 */
function capitalize(string) {
    return string.replaceAll(/\b\w(?!\s)/giu, (letter) => letter.toUpperCase());
}
/**
 * Truncate a string based on a given max length.
 * @param string
 * @param maxLength
 * @param options
 * @returns
 */
function truncate(string, maxLength, options) {
    const { indicator } = {
        indicator: "...",
        ...(options || {}),
    };
    if (string.length <= maxLength) {
        return string;
    }
    const slicedString = string
        .slice(0, maxLength - indicator.length)
        .replace(/\s$/u, "");
    return `${slicedString}${indicator}`;
}
function getCodePoints(string) {
    if (string.length === 1) {
        const codePoint = string.codePointAt(0);
        if (codePoint === undefined) {
            return [];
        }
        return [codePoint];
    }
    return string.split("").map((character) => {
        const code = character.codePointAt(0);
        if (code === undefined) {
            throw new Error("Undefined character code found.");
        }
        return code;
    });
}
export { capitalize, truncate, getCodePoints };
