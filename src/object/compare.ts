import type { EqeqeqOptions } from "../types/object.js";

/**
 * Deep comparison of two javascript objects or arrays.
 * @param a
 * @param b
 * @param options
 * @returns
 */
function eqeqeq<Atype>(
    a: Atype,
    b: unknown,
    options?: Partial<EqeqeqOptions>,
): b is Atype {
    const { max_depth, sort_arrays }: EqeqeqOptions = {
        max_depth: 0,
        sort_arrays: false,
        ...(options || {}),
    };

    const firstCall: [Atype, unknown] = [a, b];
    const callStack: [unknown, unknown][] = [firstCall];

    let isEqual: boolean = true;

    while (callStack.length > 0) {
        const [aFrame, bFrame] = callStack.pop() as [unknown, unknown];

        if (max_depth > 0 && callStack.length > max_depth) {
            console.warn("eqeqeq: ERROR - MAX DEPTH REACHED");
            isEqual = false;
            continue;
        }

        if (!isEqual) {
            break;
        }

        if (!isObject(aFrame) || !isObject(bFrame)) {
            isEqual = aFrame === bFrame;
            continue;
        }
        const aIsArray = Array.isArray(aFrame);
        const bIsArray = Array.isArray(bFrame);
        if (aIsArray !== bIsArray) {
            isEqual = false;
            continue;
        }

        if (aIsArray && bIsArray) {
            if (aFrame.length !== bFrame.length) {
                isEqual = false;
                continue;
            }
            const aSorted = sort_arrays ? aFrame.toSorted() : aFrame;
            const bSorted = sort_arrays ? bFrame.toSorted() : bFrame;
            for (let i = aSorted.length - 1; i >= 0; i--) {
                const aElement: unknown = aSorted[i];
                const bElement: unknown = bSorted[i];

                callStack.push([aElement, bElement]);
            }

            continue;
        }

        const entriesA = Object.entries(aFrame);
        const entriesB = Object.entries(bFrame);
        if (entriesA.length !== entriesB.length) {
            isEqual = false;
            break;
        }

        for (const entryA of entriesA) {
            const [key, value] = entryA as [string, unknown];
            if (!Object.hasOwn(bFrame, key)) {
                isEqual = false;
                break;
            }

            callStack.push([value, (bFrame as Record<string, unknown>)[key]]);
        }
    }
    return isEqual;
}

function isNonArrayObject(data: unknown): data is object {
    return Boolean(data) && typeof data === "object" && !Array.isArray(data);
}

function isObject(data: unknown): data is object | unknown[] {
    return typeof data === "object" && data !== null;
}

export { eqeqeq, isNonArrayObject, isObject };
