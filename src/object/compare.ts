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
    const eqOptions: EqeqeqOptions = { maxDepth: 0, ...(options || {}) };

    return eqeqeqHandler(inputA, inputB, eqOptions.maxDepth);

    function eqeqeqHandler(
        inputA: unknown,
        inputB: unknown,
        maxDepth: number,
        depth: number = 0,
    ): boolean {
        const nextDepth: number = depth + 1;
        const isBeyondMaxDepth: boolean = maxDepth > 0 && depth > maxDepth;

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

    function arraysEqual(
        arrayA: unknown[],
        arrayB: unknown[],
        max_depth: number,
        depth: number,
    ) {
        if (arrayA.length !== arrayB.length) {
            return false;
        }
        const aSorted = arrayA.toSorted();
        const bSorted = arrayB.toSorted();
        return aSorted.every((value, index) =>
            eqeqeqHandler(value, bSorted[index], max_depth, depth),
        );
    }
    function objectsEqual(
        objectA: object,
        objectB: object,
        max_depth: number,
        depth: number,
    ): boolean {
        if (Array.isArray(objectA) !== Array.isArray(objectB)) {
            return false;
        }

        const entriesA = Object.entries(objectA);
        const keysB = Object.keys(objectB);
        if (entriesA.length !== keysB.length) {
            return false;
        }

        const objectsAreSame: boolean = entriesA.every(([key, value]) => {
            return eqeqeqHandler(
                value,
                (objectB as any)[key],
                max_depth,
                depth,
            );
        });
        return objectsAreSame;
    }
}
function isNonArrayObject(item: unknown): item is object {
    return Boolean(item) && typeof item === "object" && !Array.isArray(item);
}

export { eqeqeq, isNonArrayObject };
