import type { DirectionMap, DirectionMapEntry, KeyMap } from "../../types/console/readline-selector.js";
declare function createKeyMap(directionMap: DirectionMap): KeyMap;
declare function normalizeKey(key: DirectionMapEntry): any;
export { createKeyMap, normalizeKey };
