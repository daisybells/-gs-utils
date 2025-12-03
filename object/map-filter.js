/**
 * Map and filter an array at the same time to prevent multiple passes.
 * @param {Array<never>} array
 * @param {function (value: never, index: number, array: never[]): any} callback
 * @returns {Array<never>}
 */
function mapFilter(array, callback) {
    return array.reduce((accumulator, currentValue, index, inputArray) => {
        const transformedValue = callback(currentValue, index, inputArray);

        if (transformedValue === null) return accumulator;

        return [...accumulator, transformedValue];
    }, []);
}

export { mapFilter };
