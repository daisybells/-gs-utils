/**
 * Sort list alphabetically.
 * @param array Array to be sorted.
 * @param callback Callback strings nested in objects.
 * @returns
 */
declare function sortAlphabetical<ElementType>(array: ElementType[], callback?: (value: ElementType) => unknown): ElementType[];
export { sortAlphabetical };
