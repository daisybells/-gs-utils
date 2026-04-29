import type { DataMap, CFormatter } from "../types/string.js";
/**
 * Initialize instance of C-Like Formatter.
 * @param dataMap Map of character identifiers and their given value.
 * @returns
 */
declare function initializeCFormatter(dataMap: DataMap): CFormatter;
export { initializeCFormatter };
