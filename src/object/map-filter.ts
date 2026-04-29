/**
 * Map and filter an array at the same time, removing null values.
 * @param array
 * @param callback
 * @returns
 */
function mapFilter<ElementType>(
    array: ElementType[],
    callback: (
        value: ElementType,
        index: number,
        array: ElementType[],
    ) => ElementType | null,
): ElementType[] {
    return array.reduce(
        (
            accumulator: ElementType[],
            currentValue: ElementType,
            index: number,
            inputArray: ElementType[],
        ) => {
            const transformedValue: ElementType | null = callback(
                currentValue,
                index,
                inputArray,
            );

            if (transformedValue === null) {
                return accumulator;
            }

            return [...accumulator, transformedValue];
        },
        [],
    );
}

export { mapFilter };
