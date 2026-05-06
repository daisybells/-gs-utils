type Success<T> = {
    success: true;
    data: T;
};
type Failure<E> = {
    success: false;
    error: E;
};
export type Result<S, E = Error> = Success<S> | Failure<E>;
export {};
