import type { SortArrayByFrequencyOptions } from "../types/object.js";
/**
 * Sort array by frequency of occurences of a given input.
 * @param array
 * @returns
 */
declare function sortArrayByFrequency<ArrayItem>(array: ArrayItem[], options?: Partial<SortArrayByFrequencyOptions>): ArrayItem[];
export { sortArrayByFrequency };
