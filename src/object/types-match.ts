import { isObject } from "./compare.js";

function typesMatch<T>(base: T, data: unknown): data is T {
    const baseIsObject = isObject(base);
    const dataIsObject = isObject(data);

    if (!baseIsObject) {
        return typeof base === typeof data;
    }
    if (!dataIsObject) {
        return false;
    }

    if (Array.isArray(base)) {
        if (!Array.isArray(data)) {
            return false;
        }

        const baseTypes = new Set(base.map((value) => typeof value));
        const dataTypes = new Set(data.map((value) => typeof value));

        return [...dataTypes].every((dataType) => {
            if (dataType !== "object") {
                return baseTypes.has(dataType);
            }
            const baseEntries = base.filter((value) => {
                return isObject(value);
            });
            const dataEntries = data.filter((value) => {
                return isObject(value);
            });

            return dataEntries.every((dataEntry) => {
                if (typeof dataEntry !== dataType) {
                    return true;
                }
                const hasMatchingBaseEntry = baseEntries.some((baseEntry) =>
                    typesMatch(baseEntry, dataEntry),
                );
                return hasMatchingBaseEntry;
            });
        });
    }

    return Object.entries(data).every(([key, dataValue]: [string, unknown]) => {
        if (!(key in base)) {
            return false;
        }
        const baseValue: unknown = (base as Record<string, unknown>)[key];
        if (!typesMatch(baseValue, dataValue)) {
            return false;
        }
        return true;
    });
}

export { typesMatch };
