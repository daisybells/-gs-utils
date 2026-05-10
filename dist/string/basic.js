import path from "node:path";
/**
 * Capitalize the first letter of every word.
 * @param string
 * @returns
 */
function capitalize(string) {
    return string.replaceAll(/\b\w(?!\s)/giu, (letter) => letter.toUpperCase());
}
function removeExtension(filepath) {
    const lastSeparatorIndex = filepath.lastIndexOf(path.sep);
    const lastDotIndex = filepath.lastIndexOf(".");
    if (lastSeparatorIndex > lastDotIndex) {
        return filepath;
    }
    return filepath.slice(0, filepath.lastIndexOf("."));
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
export { capitalize, getCodePoints, removeExtension };
