/**
 * Sort list alphabetically.
 * @param array Array to be sorted.
 * @param callback Callback strings nested in objects.
 * @returns
 */
function sortAlphabetical(array, callback) {
    const hasCallback = typeof callback === "function";
    return array.sort((a, b) => {
        const aValue = hasCallback ? callback(a) : a;
        const bValue = hasCallback ? callback(b) : b;
        if (typeof aValue === "string" && typeof bValue === "string") {
            if (aValue < bValue) {
                return -1;
            }
            if (aValue > bValue) {
                return 1;
            }
            return 0;
        }
        if (typeof aValue === "number" && typeof bValue === "number") {
            return aValue - bValue;
        }
        return 1;
    });
}
export { sortAlphabetical };
