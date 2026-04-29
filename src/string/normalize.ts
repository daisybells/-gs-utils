import type { NormalizeStringOptions } from "../types/string.js";

/**
 * Normalizes strings.
 *
 * @returns Normalized string.
 */
function normalizeString(
    /** String to be normalized */
    string: string,
    options?: Partial<NormalizeStringOptions>,
): string {
    const {
        preserveSpaces,
        collapseWhiteSpace,
        spaceCharacter,
    }: NormalizeStringOptions = {
        preserveSpaces: true,
        collapseWhiteSpace: true,
        spaceCharacter: "-",
        ...(options || {}),
    };
    const clearedSpaceCharacter: string = clearRegex(spaceCharacter);

    const replacedString: string = string.replaceAll(
        /[^\d\w]/gmu,
        preserveSpaces ? spaceCharacter : "",
    );

    if (!collapseWhiteSpace || !preserveSpaces) {
        return replacedString;
    }

    const collapseRegexString: string = `${clearedSpaceCharacter}{2,}`;
    const collapseRegex: RegExp = new RegExp(collapseRegexString, "gu");

    return replacedString.replaceAll(collapseRegex, spaceCharacter);
}

/**
 * Replace all REGEX special characters with their escaped counterparts
 * @param string
 * @returns
 */
function clearRegex(string: string): string {
    return string.replaceAll(/[.*+?^${}()|[\]\\]/gu, "\\$&");
}

export { normalizeString, clearRegex };
