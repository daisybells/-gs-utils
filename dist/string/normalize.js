/**
 * Normalizes strings.
 *
 * @returns Normalized string.
 */
function normalizeString(
/** String to be normalized */
string, options) {
    const { preserveSpaces, collapseWhiteSpace, spaceCharacter, } = {
        preserveSpaces: true,
        collapseWhiteSpace: true,
        spaceCharacter: "-",
        ...(options || {}),
    };
    const clearedSpaceCharacter = clearRegex(spaceCharacter);
    const replacedString = string.replaceAll(/[^\d\w]/gmu, preserveSpaces ? spaceCharacter : "");
    if (!collapseWhiteSpace || !preserveSpaces) {
        return replacedString;
    }
    const collapseRegexString = `${clearedSpaceCharacter}{2,}`;
    const collapseRegex = new RegExp(collapseRegexString, "gu");
    return replacedString.replaceAll(collapseRegex, spaceCharacter);
}
/**
 * Replace all REGEX special characters with their escaped counterparts
 * @param string
 * @returns
 */
function clearRegex(string) {
    return string.replaceAll(/[.*+?^${}()|[\]\\]/gu, "\\$&");
}
export { normalizeString, clearRegex };
