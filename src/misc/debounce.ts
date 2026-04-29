import type { Promisify } from "@/types/misc.js";

/**
 * Sleep for a given amount of time (ms)
 * @param time_milliseconds
 * @returns
 */
function sleep(time_milliseconds: number): Promise<void> {
    return new Promise((resolve) =>
        setTimeout(() => {
            resolve();
        }, time_milliseconds),
    );
}

/**
 * Debounce a function for a given amount of time (ms)
 * @param callback
 * @param timeout
 * @returns
 */
function debounce<FunctionType extends (...args: any[]) => any>(
    callback: FunctionType,
    timeout: number = 300,
): Promisify<FunctionType> {
    let timer: NodeJS.Timeout | null = null;

    return ((..._arguments: Parameters<FunctionType>) => {
        return new Promise((resolve, reject) => {
            if (timer) {
                clearTimeout(timer);
            }
            timer = setTimeout(() => {
                try {
                    resolve(callback(..._arguments));
                } catch (error) {
                    reject(error);
                }
            }, timeout);
        });
    }) as Promisify<FunctionType>;
}

/**
 * Ensure that only one of one or more functions are running at any given time.
 * @param callbacks
 * @returns
 */
function singleFlight<InputFunctions extends ((...args: any[]) => any)[]>(
    ...callbacks: InputFunctions
): {
    [Index in keyof InputFunctions]: InputFunctions[Index] extends (
        ...args: any[]
    ) => any
        ? Promisify<InputFunctions[Index]>
        : never;
} {
    let isRunning: boolean = false;

    return callbacks.map((callback) => singleFlightHandler(callback)) as any;

    function singleFlightHandler(callback: (...args: any[]) => any) {
        let lastResult: unknown = null;
        return async (...arguments_: any[]) => {
            if (isRunning) {
                return lastResult;
            }
            isRunning = true;

            try {
                lastResult = await callback(...arguments_);
            } finally {
                if (isRunning === true) isRunning = false;
            }
            return lastResult;
        };
    }
}

function throttle<FunctionType extends (...args: any) => void>(
    callback: FunctionType,
    delay: number,
): (...args: Parameters<FunctionType>) => void {
    const queue: Parameters<FunctionType>[] = [];
    let isRunning: boolean = false;

    const processQueue = () => {
        if (isRunning || queue.length === 0) {
            return;
        }

        isRunning = true;
        const args: Parameters<FunctionType> | never[] = queue.shift() || [];

        callback(...args);

        setTimeout(() => {
            isRunning = false;
            processQueue();
        }, delay);
    };
    return (...args: Parameters<FunctionType>) => {
        queue.push(args || []);
        processQueue();
    };
}

export { sleep, debounce, singleFlight, throttle };
