/**
 * Pause an asynchronous function for a set number of miliseconds.
 * @param {Number} time_milliseconds - Length of sleep in miliseconds.
 * @returns {Promise<void>}
 */
function sleep(time_milliseconds) {
    return new Promise((resolve) =>
        setTimeout(() => {
            resolve();
        }, time_milliseconds)
    );
}

/**
 * Create a debounced version of a function that delayes invoking the callback
 * until after a given timeout (ms) since the last function was invoked.
 *
 * @template {(...arguments_: any[]) => any} InputFunction
 * @param {InputFunction} callback
 * @param {Number} [timeout = 300] - Time between function calls (ms)
 * @returns {(...arguments_: Parameters<InputFunction>) => Promise<ReturnType<InputFunction>>}
 */
function debounce(callback, timeout = 300) {
    let timer;

    return (...arguments_) => {
        return new Promise((resolve, reject) => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                try {
                    resolve(callback(...arguments_));
                } catch (error) {
                    reject(error);
                }
            }, timeout);
        });
    };
}

/**
 * @template {(...arguments_: any[]) => any} InputFunction
 * @typedef {(...arguments_: Parameters<InputFunction>) => Promise<ReturnType<InputFunction>>} DebouncedFunction
 */

/**
 * @template {(...arguments_: any[]) => any} T
 * @overload
 * @param {T} callback
 * @returns {DebouncedFunction<T>}
 */

/**
 * @template {(...arguments_: any[]) => any} T
 * @template {(...arguments_: any[]) => any} U
 * @overload
 * @param {T} callback1
 * @param {U} callback2
 * @returns {[DebouncedFunction<T>, DebouncedFunction<U>]}
 */

/**
 * @template {(...arguments_: any[]) => any} T
 * @template {(...arguments_: any[]) => any} U
 * @template {(...arguments_: any[]) => any} V
 * @overload
 * @param {T} callback1
 * @param {U} callback2
 * @param {V} callback3
 * @returns {[DebouncedFunction<T>, DebouncedFunction<U>]}
 */

/**
 * @template {(...arguments_: any[]) => any} T
 * @template {(...arguments_: any[]) => any} U
 * @template {(...arguments_: any[]) => any} V
 * @template {(...arguments_: any[]) => any} W
 * @overload
 * @param {T} callback1
 * @param {U} callback2
 * @param {V} callback3
 * @param {W} callback4
 * @returns {[DebouncedFunction<T>, DebouncedFunction<U>]}
 */

/**
 * @param {...((...arguments_: any[]) => any)} callbacks
 * @returns {DebouncedFunction<any> | DebouncedFunction<any>[]}
 */
function singleFlight(...callbacks) {
    let isRunning = false;

    if (callbacks.length === 1) return singleFlightHandler(callbacks[0]);

    const outputCallbacks = callbacks.map((callback) =>
        singleFlightHandler(callback)
    );
    return outputCallbacks;

    /**
     * @template {(...arguments_: any[])=> any} InputFunction
     * @param {InputFunction} callback
     * @returns {DebouncedFunction<InputFunction>}
     */
    function singleFlightHandler(callback) {
        let lastResult;
        return async (...arguments_) => {
            if (isRunning) {
                return lastResult;
            }
            isRunning = true;

            try {
                lastResult = await Promise.resolve(callback(...arguments_));
            } finally {
                if (isRunning === true) isRunning = false;
            }
            return lastResult;
        };
    }
}

export { sleep, debounce, singleFlight };
