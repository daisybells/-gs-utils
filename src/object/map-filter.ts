/**
 * Map and filter an array at the same time, removing null values.
 * @param array
 * @param callback
 * @returns
 */
function mapFilter<T, R>(
	array: T[],
	callback: (value: T, index: number, array: T[]) => R | null,
): R[] {
	return array.reduce(
		(accumulator: R[], currentValue: T, index: number, inputArray: T[]) => {
			const transformedValue: R | null = callback(
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
