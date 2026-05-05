import { sortAlphabetical } from "./sort-alphabetical.js";
/**
 * Sort array by frequency of occurences of a given input.
 * @param array
 * @returns
 */
function sortArrayByFrequency(array, options) {
    const { alphabetize } = {
        alphabetize: true,
        ...(options || {}),
    };
    const frequencyMap = new Map();
    for (const item of array) {
        frequencyMap.set(item, (frequencyMap.get(item) || 0) + 1);
    }
    let outputArray = [...array];
    if (alphabetize) {
        outputArray = sortAlphabetical(outputArray);
    }
    return outputArray.toSorted((a, b) => {
        const aOccurences = frequencyMap.get(a) || 0;
        const bOccurences = frequencyMap.get(b) || 0;
        const sameAmount = aOccurences === bOccurences;
        if (sameAmount) {
            return 0;
        }
        return bOccurences - aOccurences;
    });
}
export { sortArrayByFrequency };
