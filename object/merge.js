import { isObject } from "./compare.js";

/**
 * Deep merge two objects
 *
 * @param {Object} base
 * @param  {Object} source
 * @returns {Object}
 */
function merge(base, source) {
    const mergedObject = { ...base };

    for (const key in source) {
        if (!source.hasOwnProperty(key)) {
            continue;
        }

        const baseValue = mergedObject[key];
        const sourceValue = source[key];

        if (!isObject(baseValue) || !isObject(sourceValue)) {
            mergedObject[key] = sourceValue;
            continue;
        }

        mergedObject[key] = merge(baseValue, sourceValue);
    }

    return mergedObject;
}

export { merge };
