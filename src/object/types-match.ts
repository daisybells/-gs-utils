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
        if (data.length === 0) {
            return true;
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
                const hasMatchingBaseEntry = baseEntries.some((baseEntry) => {
                    return typesMatch(baseEntry, dataEntry);
                });
                return hasMatchingBaseEntry;
            });
        });
    }

    const dataEntries = Object.entries(data);
    const baseKeys = Object.keys(base);
    if (dataEntries.length !== baseKeys.length) {
        return false;
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

function isObject(data: unknown): data is object {
    return typeof data === "object" && data !== null;
}

export { typesMatch };
