/**
 * Map and filter an array at the same time, removing null values.
 * @param array
 * @param callback
 * @returns
 */
declare function mapFilter<T, R>(array: T[], callback: (value: T, index: number, array: T[]) => R | null): R[];
export { mapFilter };
