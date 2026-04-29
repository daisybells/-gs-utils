import { getCodePoints } from "../../string/basic.js";
function createKeyMap(directionMap) {
    const keyMap = new Map();
    const entries = Object.entries(directionMap);
    for (const [direction, keys] of entries) {
        if (!isInMap(direction, directionMap)) {
            continue;
        }
        for (const key of keys) {
            keyMap.set(normalizeKey(key), direction);
        }
    }
    return keyMap;
}
function isInMap(key, map) {
    return key in map;
}
function normalizeKey(key) {
    const JOIN_CHARACTER = ",";
    if (Array.isArray(key)) {
        return key.join(JOIN_CHARACTER);
    }
    else if (typeof key === "number") {
        return String(key);
    }
    else {
        return getCodePoints(key).join(JOIN_CHARACTER);
    }
}
export { createKeyMap, normalizeKey };
//# sourceMappingURL=key-reader.js.map