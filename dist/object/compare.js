/**
 * Deep comparison of two javascript objects or arrays.
 * @param inputA
 * @param inputB
 * @param options
 * @returns
 */
function eqeqeq(inputA, inputB, options) {
    const eqOptions = {
        max_depth: 0,
        sort_arrays: false,
        ...(options || {}),
    };
    return eqeqeqHandler(inputA, inputB, eqOptions);
}
function eqeqeqHandler(inputA, inputB, options, depth = 0) {
    const { max_depth } = options;
    const nextDepth = depth + 1;
    const isBeyondMaxDepth = max_depth > 0 && depth > max_depth;
    switch (true) {
        case isBeyondMaxDepth:
            throw new Error("Error: max depth reached on eqeqeq.");
        case typeof inputA !== "object" ||
            typeof inputB !== "object" ||
            inputA === null ||
            inputB === null:
            return inputA === inputB;
        case Array.isArray(inputA) && Array.isArray(inputB):
            return arraysEqual(inputA, inputB, options, nextDepth);
        default:
            return objectsEqual(inputA, inputB, options, nextDepth);
    }
}
function arraysEqual(arrayA, arrayB, options, depth) {
    if (!Array.isArray(arrayA) || !Array.isArray(arrayB)) {
        throw new Error("Only arrays accepted as input.");
    }
    const { sort_arrays } = options;
    if (arrayA.length !== arrayB.length) {
        return false;
    }
    const aSorted = sort_arrays ? arrayA.toSorted() : arrayA;
    const bSorted = sort_arrays ? arrayB.toSorted() : arrayB;
    return aSorted.every((value, index) => eqeqeqHandler(value, bSorted[index], options, depth));
}
function objectsEqual(objectA, objectB, options, depth) {
    if (!isNonArrayObject(objectA) || !isNonArrayObject(objectB)) {
        throw new Error("Only non-array objects accepted as input.");
    }
    const entriesA = Object.entries(objectA);
    const keysB = Object.keys(objectB);
    if (entriesA.length !== keysB.length) {
        return false;
    }
    const objectsAreSame = entriesA.every(([key, value]) => {
        return eqeqeqHandler(value, objectB[key], options, depth);
    });
    return objectsAreSame;
}
function isNonArrayObject(data) {
    return Boolean(data) && typeof data === "object" && !Array.isArray(data);
}
function isObject(data) {
    return typeof data === "object" && data !== null;
}
export { eqeqeq, isNonArrayObject, isObject };
//# sourceMappingURL=compare.js.map