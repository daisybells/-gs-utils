import type { CFormatString } from "../types/string.js";
import type { LogProgressOptions, GenerateMessage } from "../types/console.js";
/**
 * Creates a function that tracks an item in terminal.
 * @param count Number of items to log.
 * @param message Message output for each iteration, utilizing the following
 * C formatted specifiers for string input:
 * - %c: current value.
 * - %i: current index.
 * - %m: max value.
 * - %p: current percentage.
 * Can be replaced with a pure callback function.
 * @param options
 */
declare function createProgressLogger<T>(message?: CFormatString | GenerateMessage<T>, options?: Partial<LogProgressOptions>): {
    log: (value: T, index: number, max: number) => void;
};
/**
 * Take an array of promises and pretty prints a console.log for each
 * iteration of the array.
 * @param promises Array of asynchronous promises.
 * @param message Message output for each iteration, utilizing the following
 * C formatted specifiers for string input:
 * - %c: current value.
 * - %i: current index.
 * - %m: max value.
 * - %p: current percentage.
 * Can be replaced with a pure callback function.
 * @param options
 * @returns
 */
declare function logPromiseArray<T>(promises: Promise<T>[], message?: CFormatString | GenerateMessage<T>, options?: Partial<LogProgressOptions>): Promise<Awaited<T>[]>;
export { logPromiseArray, createProgressLogger };
