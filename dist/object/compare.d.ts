import type { EqeqeqOptions } from "../types/object.js";
/**
 * Deep comparison of two javascript objects or arrays.
 * @param inputA
 * @param inputB
 * @param options
 * @returns
 */
declare function eqeqeq(inputA: unknown, inputB: unknown, options?: Partial<EqeqeqOptions>): boolean;
declare function isNonArrayObject(item: unknown): item is object;
declare function isObject(data: unknown): data is object;
export { eqeqeq, isNonArrayObject, isObject };
