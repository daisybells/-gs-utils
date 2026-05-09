function conditionalLog(shouldLog: boolean) {
	return (...messages: unknown[]): void => {
		if (shouldLog) {
			console.log(...messages);
		}
	};
}

export { conditionalLog };
