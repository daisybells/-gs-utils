/**
 * Sort list alphabetically.
 * @param array Array to be sorted.
 * @param callback Callback strings nested in objects.
 * @returns
 */
function sortAlphabetical<ElementType>(
    array: ElementType[],
    callback?: (value: ElementType) => string,
): ElementType[] {
    const hasCallback = typeof callback === "function";
    return array.sort((a, b) => {
        const aValue: any = hasCallback ? callback(a) : a;
        const bValue: any = hasCallback ? callback(b) : b;

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
