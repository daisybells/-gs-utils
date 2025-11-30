function mapFilter(array, callback) {
    return array.reduce((accumulator, currentValue, index, inputArray) => {
        const transformedValue = callback(currentValue, index, inputArray);

        if (!transformedValue) return accumulator;

        return [...accumulator, transformedValue];
    }, []);
}
function mapFilterAsync(array, callback) {
    return array.reduce(
        async (accumulatorPromise, currentValue, index, inputArray) => {
            const accumulator = await accumulatorPromise;
            const transformedValue = await callback(
                currentValue,
                index,
                inputArray
            );
            if (!transformedValue) return accumulator;

            return [...accumulator, transformedValue];
        },
        []
    );
}

export { mapFilter, mapFilterAsync };
