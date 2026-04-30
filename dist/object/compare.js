/**
 * Deep comparison of two javascript objects or arrays.
 * @param inputA
 * @param inputB
 * @param options
 * @returns
 */
function eqeqeq(inputA, inputB, options) {
    const eqOptions = { maxDepth: 0, ...(options || {}) };
    return eqeqeqHandler(inputA, inputB, eqOptions.maxDepth);
    function eqeqeqHandler(inputA, inputB, maxDepth, depth = 0) {
        const nextDepth = depth + 1;
        const isBeyondMaxDepth = maxDepth > 0 && depth > maxDepth;
        switch (true) {
            case isBeyondMaxDepth:
                throw new Error("Error: max depth reached on eqeqeq.");
            case typeof inputA !== "object" ||
                typeof inputB !== "object" ||
                inputA === null ||
                inputB === null:
                return inputA === inputB;
            case Array.isArray(inputA) && Array.isArray(inputB):
                return arraysEqual(inputA, inputB, maxDepth, nextDepth);
            default:
                return objectsEqual(inputA, inputB, maxDepth, nextDepth);
        }
    }
    function arraysEqual(arrayA, arrayB, max_depth, depth) {
        if (arrayA.length !== arrayB.length) {
            return false;
        }
        const aSorted = arrayA.toSorted();
        const bSorted = arrayB.toSorted();
        return aSorted.every((value, index) => eqeqeqHandler(value, bSorted[index], max_depth, depth));
    }
    function objectsEqual(objectA, objectB, max_depth, depth) {
        if (Array.isArray(objectA) !== Array.isArray(objectB)) {
            return false;
        }
        const entriesA = Object.entries(objectA);
        const keysB = Object.keys(objectB);
        if (entriesA.length !== keysB.length) {
            return false;
        }
        const objectsAreSame = entriesA.every(([key, value]) => {
            return eqeqeqHandler(value, objectB[key], max_depth, depth);
        });
        return objectsAreSame;
    }
}
function isNonArrayObject(item) {
    return Boolean(item) && typeof item === "object" && !Array.isArray(item);
}
export { eqeqeq, isNonArrayObject };
//# sourceMappingURL=compare.js.map