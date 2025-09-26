function delayIteration(time_milliseconds) {
    return new Promise((resolve) => setTimeout(resolve, time_milliseconds));
}

export { delayIteration };
