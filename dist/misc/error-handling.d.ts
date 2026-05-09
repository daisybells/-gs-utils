import type { Result } from "../types/misc.js";
declare function tryCatch<T, E extends Error>(promise: Promise<T>): Promise<Result<T, E>>;
declare function succeeded<S>(data: S): Result<S, never>;
declare function failed<E>(error: E): Result<never, E>;
export { tryCatch, succeeded, failed };
