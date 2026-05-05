/**
 * Sleep for a given amount of time (ms)
 * @param time_milliseconds
 * @returns
 */
async function sleep(time_milliseconds) {
    await new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, time_milliseconds);
    });
}
/**
 * Debounce a function for a given amount of time (ms)
 * @param callback
 * @param timeout
 * @returns
 */
function debounce(callback, timeout = 300) {
    let timer = null;
    return (..._arguments) => {
        return new Promise((resolve, reject) => {
            if (timer) {
                clearTimeout(timer);
            }
            timer = setTimeout(() => {
                try {
                    resolve(callback(..._arguments));
                }
                catch (error) {
                    reject(new Error("Debounce function failed.", {
                        cause: error,
                    }));
                }
            }, timeout);
        });
    };
}
/**
 * Ensure that only one of one or more functions are running at any given time.
 * @param callbacks
 * @returns
 */
function singleFlight(...callbacks) {
    let isRunning = false;
    return callbacks.map((callback) => singleFlightHandler(callback));
    function singleFlightHandler(callback) {
        return async (...args) => {
            if (isRunning) {
                return;
            }
            isRunning = true;
            try {
                await callback(...args);
            }
            finally {
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                if (isRunning) {
                    isRunning = false;
                }
            }
        };
    }
}
function throttle(callback, delay) {
    const callStack = [];
    let isRunning = false;
    const processQueue = () => {
        if (isRunning || callStack.length === 0) {
            return;
        }
        isRunning = true;
        const args = callStack.shift();
        if (!args) {
            return;
        }
        callback(...args);
        setTimeout(() => {
            isRunning = false;
            processQueue();
        }, delay);
    };
    return (...args) => {
        callStack.push(args);
        processQueue();
    };
}
export { sleep, debounce, singleFlight, throttle };
