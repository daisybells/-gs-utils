import type { EqeqeqOptions } from "../types/object.js";

/**
 * Deep comparison of two javascript objects or arrays.
 * @param inputA
 * @param inputB
 * @param options
 * @returns
 */
function eqeqeq(
    inputA: unknown,
    inputB: unknown,
    options?: Partial<EqeqeqOptions>,
): boolean {
    const eqOptions: EqeqeqOptions = {
        max_depth: 0,
        sort_arrays: false,
        ...(options || {}),
    };

    return eqeqeqHandler(inputA, inputB, eqOptions);
}
function eqeqeqHandler(
    inputA: unknown,
    inputB: unknown,
    options: EqeqeqOptions,
    depth: number = 0,
): boolean {
    const { max_depth } = options;
    const nextDepth: number = depth + 1;
    const isBeyondMaxDepth: boolean = max_depth > 0 && depth > max_depth;

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

function arraysEqual(
    arrayA: unknown[],
    arrayB: unknown[],
    options: EqeqeqOptions,
    depth: number,
) {
    if (!Array.isArray(arrayA) || !Array.isArray(arrayB)) {
        throw new Error("Only arrays accepted as input.");
    }
    const { sort_arrays }: EqeqeqOptions = options;

    if (arrayA.length !== arrayB.length) {
        return false;
    }
    const aSorted = sort_arrays ? arrayA.toSorted() : arrayA;
    const bSorted = sort_arrays ? arrayB.toSorted() : arrayB;
    return aSorted.every((value, index) =>
        eqeqeqHandler(value, bSorted[index], options, depth),
    );
}
function objectsEqual(
    objectA: object,
    objectB: object,
    options: EqeqeqOptions,
    depth: number,
): boolean {
    if (!isNonArrayObject(objectA) || !isNonArrayObject(objectB)) {
        throw new Error("Only non-array objects accepted as input.");
    }

    const entriesA = Object.entries(objectA);
    const keysB = Object.keys(objectB);
    if (entriesA.length !== keysB.length) {
        return false;
    }

    const objectsAreSame: boolean = entriesA.every(([key, value]) => {
        return eqeqeqHandler(
            value,
            (objectB as Record<string, unknown>)[key],
            options,
            depth,
        );
    });
    return objectsAreSame;
}

function isNonArrayObject(data: unknown): data is object {
    return Boolean(data) && typeof data === "object" && !Array.isArray(data);
}

function isObject(data: unknown): data is object | unknown[] {
    return typeof data === "object" && data !== null;
}

export { eqeqeq, isNonArrayObject, isObject };
