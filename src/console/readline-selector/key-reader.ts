import { getCodePoints } from "@/string/basic.js";
import type {
    DirectionMap,
    DirectionMapEntry,
    KeyMap,
    MoveDirection,
} from "@/types/console/readline-selector.js";

function createKeyMap(directionMap: DirectionMap): KeyMap {
    const keyMap: Map<string, MoveDirection> = new Map();

    const entries: [string | keyof DirectionMap, DirectionMapEntry[]][] =
        Object.entries(directionMap);

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

function isInMap<T, K extends { [key: string]: T }>(
    key: any,
    map: K,
): key is keyof K {
    return key in map;
}

function normalizeKey(key: DirectionMapEntry): any {
    const JOIN_CHARACTER = ",";
    if (Array.isArray(key)) {
        return key.join(JOIN_CHARACTER);
    } else if (typeof key === "number") {
        return String(key);
    } else {
        return getCodePoints(key).join(JOIN_CHARACTER);
    }
}
export { createKeyMap, normalizeKey };
