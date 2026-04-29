import type { Promisify } from "../types/misc.js";
/**
 * Sleep for a given amount of time (ms)
 * @param time_milliseconds
 * @returns
 */
declare function sleep(time_milliseconds: number): Promise<void>;
/**
 * Debounce a function for a given amount of time (ms)
 * @param callback
 * @param timeout
 * @returns
 */
declare function debounce<FunctionType extends (...args: any[]) => any>(callback: FunctionType, timeout?: number): Promisify<FunctionType>;
/**
 * Ensure that only one of one or more functions are running at any given time.
 * @param callbacks
 * @returns
 */
declare function singleFlight<InputFunctions extends ((...args: any[]) => any)[]>(...callbacks: InputFunctions): {
    [Index in keyof InputFunctions]: InputFunctions[Index] extends (...args: any[]) => any ? Promisify<InputFunctions[Index]> : never;
};
declare function throttle<FunctionType extends (...args: any) => void>(callback: FunctionType, delay: number): (...args: Parameters<FunctionType>) => void;
export { sleep, debounce, singleFlight, throttle };
