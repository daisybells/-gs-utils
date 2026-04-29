import type { TruncateOptions } from "../types/string.js";
/**
 * Capitalize the first letter of every word.
 * @param string
 * @returns
 */
function capitalize(string: string): string {
    return string.replaceAll(/\b\w(?!\s)/giu, (letter: string) =>
        letter.toUpperCase(),
    );
}

/**
 * Truncate a string based on a given max length.
 * @param string
 * @param maxLength
 * @param options
 * @returns
 */
function truncate(
    string: string,
    maxLength: number,
    options?: Partial<TruncateOptions>,
): string {
    const { indicator }: TruncateOptions = {
        indicator: "...",
        ...(options || {}),
    };

    if (string.length <= maxLength) {
        return string;
    }
    const slicedString: string = string
        .slice(0, maxLength - indicator.length)
        .replace(/\s$/u, "");

    return `${slicedString}${indicator}`;
}

function getCodePoints(string: string): number[] {
    if (string.length === 1) {
        const codePoint = string.codePointAt(0);
        if (codePoint === undefined) {
            return [];
        }

        return [codePoint];
    }

    return string.split("").map((character: string): number => {
        const code: number | undefined = character.codePointAt(0);
        if (code === undefined) {
            throw new Error("Undefined character code found.");
        }
        return code;
    });
}
export { capitalize, truncate, getCodePoints };
