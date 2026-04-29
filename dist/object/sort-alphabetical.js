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
        if (aValue < bValue) {
            return -1;
        }
        if (aValue > bValue) {
            return 1;
        }
        return 0;
    });
}
export { sortAlphabetical };
//# sourceMappingURL=sort-alphabetical.js.map