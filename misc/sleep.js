/**
 * Pause an asynchronous function for a set number of miliseconds.
 * @param {Number} time_milliseconds - Length of sleep in miliseconds.
 * @returns
 */
function sleep(time_milliseconds) {
    return new Promise((resolve) => setTimeout(resolve, time_milliseconds));
}

export { sleep };
