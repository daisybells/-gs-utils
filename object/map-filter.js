/**
 * Map and filter an array at the same time to prevent multiple passes.
 * @param {any[]} array
 * @param {(value: any, index: number, array: any[]) => any|null} callback - null values are
 * removed from the array.
 * @returns {any[]}
 */
function mapFilter(array, callback) {
    return array.reduce((accumulator, currentValue, index, inputArray) => {
        const transformedValue = callback(currentValue, index, inputArray);

        if (transformedValue === null) return accumulator;

        return [...accumulator, transformedValue];
    }, []);
}

export { mapFilter };
