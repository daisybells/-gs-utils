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
declare function debounce<A, R>(callback: (...args: A[]) => R, timeout?: number): (...args: A[]) => Promise<R>;
/**
 * Ensure that only one of one or more functions are running at any given time.
 * @param callbacks
 * @returns
 */
declare function singleFlight<Callbacks extends ((...args: any[]) => unknown)[]>(...callbacks: Callbacks): {
    [Index in keyof Callbacks]: Callbacks[Index] extends (...args: (infer A)[]) => unknown ? (...args: A[]) => Promise<void> : never;
};
declare function throttle<P extends unknown[]>(callback: (...args: P) => unknown, delay: number): (...args: P) => void;
export { sleep, debounce, singleFlight, throttle };
