/**
 * Map and filter an array at the same time, removing null values.
 * @param array
 * @param callback
 * @returns
 */
declare function mapFilter<ElementType>(array: ElementType[], callback: (value: ElementType, index: number, array: ElementType[]) => ElementType | null): ElementType[];
export { mapFilter };
