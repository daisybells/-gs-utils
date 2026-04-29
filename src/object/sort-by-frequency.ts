import { sortAlphabetical } from "./sort-alphabetical.js";
import type { SortArrayByFrequencyOptions } from "../types/object.js";

/**
 * Sort array by frequency of occurences of a given input.
 * @param array
 * @returns
 */
function sortArrayByFrequency<ArrayItem>(
    array: ArrayItem[],
    options?: Partial<SortArrayByFrequencyOptions>,
): ArrayItem[] {
    const { alphabetize }: SortArrayByFrequencyOptions = {
        alphabetize: true,
        ...(options || {}),
    };

    const frequencyMap: Map<ArrayItem, number> = new Map();

    for (const item of array) {
        frequencyMap.set(item, (frequencyMap.get(item) || 0) + 1);
    }

    let outputArray = [...array];
    if (alphabetize) {
        outputArray = sortAlphabetical(outputArray);
    }

    return outputArray.toSorted((a, b) => {
        const aOccurences: number = frequencyMap.get(a) || 0;
        const bOccurences: number = frequencyMap.get(b) || 0;

        const sameAmount = aOccurences === bOccurences;

        if (sameAmount) {
            return 0;
        }
        return bOccurences - aOccurences;
    });
}
export { sortArrayByFrequency };
