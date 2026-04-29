/**
 * Sleep for a given amount of time (ms)
 * @param time_milliseconds
 * @returns
 */
function sleep(time_milliseconds) {
    return new Promise((resolve) => setTimeout(() => {
        resolve();
    }, time_milliseconds));
}
/**
 * Debounce a function for a given amount of time (ms)
 * @param callback
 * @param timeout
 * @returns
 */
function debounce(callback, timeout = 300) {
    let timer = null;
    return ((..._arguments) => {
        return new Promise((resolve, reject) => {
            if (timer) {
                clearTimeout(timer);
            }
            timer = setTimeout(() => {
                try {
                    resolve(callback(..._arguments));
                }
                catch (error) {
                    reject(error);
                }
            }, timeout);
        });
    });
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
        let lastResult = null;
        return async (...arguments_) => {
            if (isRunning) {
                return lastResult;
            }
            isRunning = true;
            try {
                lastResult = await callback(...arguments_);
            }
            finally {
                if (isRunning === true)
                    isRunning = false;
            }
            return lastResult;
        };
    }
}
function throttle(callback, delay) {
    const queue = [];
    let isRunning = false;
    const processQueue = () => {
        if (isRunning || queue.length === 0) {
            return;
        }
        isRunning = true;
        const args = queue.shift() || [];
        callback(...args);
        setTimeout(() => {
            isRunning = false;
            processQueue();
        }, delay);
    };
    return (...args) => {
        queue.push(args || []);
        processQueue();
    };
}
export { sleep, debounce, singleFlight, throttle };
//# sourceMappingURL=debounce.js.map