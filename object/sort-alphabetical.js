function sortAlphabetical(stringArray, callback) {
    const hasCallback = typeof callback === "function";
    return stringArray.sort((a, b) => {
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
