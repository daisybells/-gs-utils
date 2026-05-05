import type { EqeqeqOptions } from "../types/object.js";
/**
 * Deep comparison of two javascript objects or arrays.
 * @param a
 * @param b
 * @param options
 * @returns
 */
declare function eqeqeq(a: unknown, b: unknown, options?: Partial<EqeqeqOptions>): boolean;
declare function isNonArrayObject(data: unknown): data is object;
declare function isObject(data: unknown): data is object | unknown[];
export { eqeqeq, isNonArrayObject, isObject };
