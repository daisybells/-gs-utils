/**
 * Deep comparison of two javascript objects or arrays.
 * @param a
 * @param b
 * @param options
 * @returns
 */
function eqeqeq(a, b, options) {
    const { max_depth, sort_arrays } = {
        max_depth: 0,
        sort_arrays: false,
        ...(options || {}),
    };
    const firstCall = [a, b];
    const callStack = [firstCall];
    let isEqual = true;
    while (callStack.length > 0) {
        const [aFrame, bFrame] = callStack.pop();
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
                const aElement = aSorted[i];
                const bElement = bSorted[i];
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
            const [key, value] = entryA;
            if (!Object.hasOwn(bFrame, key)) {
                isEqual = false;
                break;
            }
            callStack.push([value, bFrame[key]]);
        }
    }
    return isEqual;
}
function isNonArrayObject(data) {
    return Boolean(data) && typeof data === "object" && !Array.isArray(data);
}
function isObject(data) {
    return typeof data === "object" && data !== null;
}
export { eqeqeq, isNonArrayObject, isObject };
