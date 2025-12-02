const areArrays = argumentsMatchCurry((element) => Array.isArray(element));

/**
 * Deep comparison function between any two arrays or objects.
 * @param {any} inputA - First object to compare to.
 * @param {any} inputB - Second object to compare to
 * @param {object} [inputOptions] - configurable function options.
 * @param {number} [inputOptions.max_depth = 5] - maximum depth for
 * object search, defaults to 5.
 * @returns {Boolean} are same (true) or are different (false)
 */
function eqeqeq(inputA, inputB, inputOptions = {}) {
    const defaultOptions = {
        max_depth: 5,
    };
    const options = { ...defaultOptions, ...inputOptions };

    return eqeqeqHandler(inputA, inputB, options.max_depth);
}

function eqeqeqHandler(inputA, inputB, max_depth, depth = 0) {
    const nextDepth = depth + 1;

    switch (true) {
        case depth > max_depth:
            throw new Error("Error: Max depth reached.");
        case typeof inputA !== typeof inputB:
            return false;
        case !inputA || typeof inputA !== "object":
            return inputA === inputB;
        case areArrays(inputA, inputB):
            return arraysEqual(inputA, inputB, max_depth, nextDepth);
        default:
            return objectsEqual(inputA, inputB, max_depth, nextDepth);
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
    return (
        aSorted.findIndex(
            (value, index) =>
                !eqeqeqHandler(value, bSorted[index], max_depth, depth)
        ) === -1
    );
}

function objectsEqual(objectA, objectB, max_depth, depth) {
    if (typeof objectA !== "object" || typeof objectA !== "object") {
        throw new Error(`Error: inputs must be of type 'object'.`);
    }

    if (Array.isArray(objectA) !== Array.isArray(objectB)) {
        return false;
    }

    const entriesA = Object.entries(objectA);
    const keysB = Object.keys(objectB);
    if (entriesA.length !== keysB.length) {
        return false;
    }

    const objectsAreSame =
        entriesA.findIndex(
            ([key, value]) =>
                !eqeqeqHandler(value, objectB[key], max_depth, depth)
        ) === -1;
    return objectsAreSame;
}

function argumentsMatchCurry(callback) {
    return (..._arguments) => {
        const indexOfFalseElement = _arguments.findIndex(
            (inputArgument) => !callback(inputArgument)
        );
        return indexOfFalseElement === -1;
    };
}

export { eqeqeq };
