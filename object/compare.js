/**
 * Deep comparison function between any two arrays or objects.
 * @param {any} inputA - First object to compare to.
 * @param {any} inputB - Second object to compare to
 * @param {object} [inputOptions] - configurable function options.
 * @param {number} [inputOptions.maxDepth = 5] - maximum depth for
 * object search, defaults to 5.
 * @returns {Boolean} are same (true) or are different (false)
 */
function eqeqeq(inputA, inputB, inputOptions = {}) {
    const areArrays = argumentsMatchCurry((element) => Array.isArray(element));
    const defaultOptions = {
        maxDepth: 0,
    };
    const options = { ...defaultOptions, ...inputOptions };

    return eqeqeqHandler(inputA, inputB, options.maxDepth);

    function eqeqeqHandler(inputA, inputB, maxDepth, depth = 0) {
        const nextDepth = depth + 1;

        switch (true) {
            case maxDepth > 0 && depth > maxDepth:
                throw new Error("Error: Max depth reached.");
            case typeof inputA !== typeof inputB:
                return false;
            case !inputA || typeof inputA !== "object":
                return inputA === inputB;
            case areArrays(inputA, inputB):
                return arraysEqual(inputA, inputB, maxDepth, nextDepth);
            default:
                return objectsEqual(inputA, inputB, maxDepth, nextDepth);
        }
    }

    function arraysEqual(arrayA, arrayB, max_depth, depth) {
        if (!areArrays(arrayA, arrayB)) {
            throw new Error(`Error: inputs must both be arrays.`);
        }
        if (arrayA.length !== arrayB.length) {
            return false;
        }
        const aSorted = arrayA.toSorted();
        const bSorted = arrayB.toSorted();
        return aSorted.every((value, index) =>
            eqeqeqHandler(value, bSorted[index], max_depth, depth)
        );
    }

    function objectsEqual(objectA, objectB, max_depth, depth) {
        if (typeof objectA !== "object" || typeof objectA !== "object") {
            throw new Error("Error: inputs must be of type 'object'.");
        }

        if (Array.isArray(objectA) || Array.isArray(objectB)) {
            throw new Error("Error: inputs cannot be arrays.");
        }

        const entriesA = Object.entries(objectA);
        const keysB = Object.keys(objectB);
        if (entriesA.length !== keysB.length) {
            return false;
        }

        const objectsAreSame = entriesA.every(([key, value]) =>
            eqeqeqHandler(value, objectB[key], max_depth, depth)
        );
        return objectsAreSame;
    }
}

function argumentsMatchCurry(callback) {
    return (..._arguments) => _arguments.every(callback);
}

export { eqeqeq };
