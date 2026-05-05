/**
 * Sleep for a given amount of time (ms)
 * @param time_milliseconds
 * @returns
 */
async function sleep(time_milliseconds: number): Promise<void> {
    await new Promise<void>((resolve) => {
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
function debounce<A>(
    callback: (...args: A[]) => unknown,
    timeout: number = 300,
): (...args: A[]) => Promise<void> {
    let timer: NodeJS.Timeout | null = null;

    return async (...args: A[]) => {
        await new Promise<void>((resolve, reject) => {
            if (timer) {
                clearTimeout(timer);
            }
            callback(...args);
            timer = setTimeout(() => {
                try {
                    callback(...args);
                    resolve();
                } catch (error) {
                    reject(
                        new Error("Debounce function failed.", {
                            cause: error,
                        }),
                    );
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
function singleFlight<Callbacks extends ((...args: any[]) => unknown)[]>(
    ...callbacks: Callbacks
): {
    [Index in keyof Callbacks]: Callbacks[Index] extends (
        ...args: (infer A)[]
    ) => unknown
        ? (...args: A[]) => Promise<void>
        : never;
} {
    let isRunning: boolean = false;

    return callbacks.map((callback) => singleFlightHandler(callback)) as never;

    function singleFlightHandler<ArgType>(
        callback: (...args: ArgType[]) => unknown,
    ): (...args: ArgType[]) => Promise<void> {
        return async (...args: ArgType[]) => {
            if (isRunning) {
                return;
            }
            isRunning = true;

            try {
                await callback(...args);
            } finally {
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                if (isRunning) {
                    isRunning = false;
                }
            }
        };
    }
}

function throttle<P extends unknown[]>(
    callback: (...args: P) => unknown,
    delay: number,
): (...args: P) => void {
    const callStack: P[] = [];

    let isRunning: boolean = false;

    const processQueue = () => {
        if (isRunning || callStack.length === 0) {
            return;
        }

        isRunning = true;
        const args: P | undefined = callStack.shift();

        if (!args) {
            return;
        }

        callback(...args);

        setTimeout(() => {
            isRunning = false;
            processQueue();
        }, delay);
    };
    return (...args: P) => {
        callStack.push(args);
        processQueue();
    };
}

export { sleep, debounce, singleFlight, throttle };
