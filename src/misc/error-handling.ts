import type { Result } from "../types/misc.js";

async function tryCatch<T, E extends new (message: string) => Error>(
    promise: Promise<T>,
): Promise<Result<T, E>> {
    try {
        const data = await promise;
        return {
            success: true,
            data,
        };
    } catch (error) {
        return {
            success: false,
            error: error as E,
        };
    }
}

function succeeded<S>(data: S): Result<S, never> {
    return {
        success: true,
        data,
    };
}

function failed<E>(error: E): Result<never, E> {
    return {
        success: false,
        error,
    };
}

export { tryCatch, succeeded, failed };
