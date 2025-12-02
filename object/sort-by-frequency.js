function sortArrayByFrequency(array) {
    const frequencyMap = new Map();

    for (const item of array) {
        frequencyMap.set(item, (frequencyMap.get(item) || 0) + 1);
    }

    return array.toSorted((a, b) => {
        const aOccurences = frequencyMap.get(a);
        const bOccurences = frequencyMap.get(b);

        const sameAmount = aOccurences === bOccurences;

        return !sameAmount ? bOccurences - aOccurences : b - a;
    });
}
export { sortArrayByFrequency };
