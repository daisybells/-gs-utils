function conditionalLog(shouldLog) {
    return (...messages) => {
        if (shouldLog) {
            console.log(...messages);
        }
    };
}
export { conditionalLog };
