import type { TruncateOptions } from "../types/string.js";
/**
 * Truncate a string based on a given max length.
 * @param string
 * @param maxLength
 * @param options
 * @returns
 */
declare function truncate(string: string, maxLength: number, options?: Partial<TruncateOptions>): string;
export { truncate };
