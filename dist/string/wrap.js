/**
 * Truncate a string based on a given max length.
 * @param string
 * @param maxLength
 * @param options
 * @returns
 */
function truncate(string, maxLength, options) {
    const { indicator, direction } = {
        indicator: "...",
        direction: 1,
        ...(options || {}),
    };
    if (string.length <= maxLength) {
        return string;
    }
    if (direction === -1) {
        const slicedString = string
            .slice(string.length - maxLength + indicator.length)
            .replace(/^s/u, "");
        return `${indicator}${slicedString}`;
    }
    const slicedString = string
        .slice(0, maxLength - indicator.length)
        .replace(/\s$/u, "");
    return `${slicedString}${indicator}`;
}
export { truncate };
