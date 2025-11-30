function mapFilter(array, callback) {
    return array.reduce((accumulator, currentValue, index, inputArray) => {
        const transformedValue = callback(currentValue, index, inputArray);

        if (!transformedValue) return accumulator;

        return [...accumulator, transformedValue];
    }, []);
}

export { mapFilter };
