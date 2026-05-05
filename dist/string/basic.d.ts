import type { TruncateOptions } from "../types/string.js";
/**
 * Capitalize the first letter of every word.
 * @param string
 * @returns
 */
declare function capitalize(string: string): string;
declare function removeExtension(filepath: string): string;
/**
 * Truncate a string based on a given max length.
 * @param string
 * @param maxLength
 * @param options
 * @returns
 */
declare function truncate(string: string, maxLength: number, options?: Partial<TruncateOptions>): string;
declare function getCodePoints(string: string): number[];
export { capitalize, truncate, getCodePoints, removeExtension };
