import type { NormalizeStringOptions } from "../types/string.js";
/**
 * Normalizes strings.
 *
 * @returns Normalized string.
 */
declare function normalizeString(
/** String to be normalized */
string: string, options?: Partial<NormalizeStringOptions>): string;
/**
 * Replace all REGEX special characters with their escaped counterparts
 * @param string
 * @returns
 */
declare function clearRegex(string: string): string;
export { normalizeString, clearRegex };
