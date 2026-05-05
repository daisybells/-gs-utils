/**
 * Map and filter an array at the same time, removing null values.
 * @param array
 * @param callback
 * @returns
 */
function mapFilter(array, callback) {
    return array.reduce((accumulator, currentValue, index, inputArray) => {
        const transformedValue = callback(currentValue, index, inputArray);
        if (transformedValue === null) {
            return accumulator;
        }
        return [...accumulator, transformedValue];
    }, []);
}
export { mapFilter };
