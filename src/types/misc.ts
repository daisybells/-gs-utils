// DEBOUNCE
export type Promisify<T extends (...args: any[]) => unknown> = T extends (
    ...args: infer A
) => infer R
    ? (...args: A) => Promise<Awaited<R>>
    : never;

export type PromisifyVoid<T extends (...args: any[]) => unknown> = T extends (
    ...args: infer A
) => unknown
    ? (...args: A) => Promise<void>
    : never;
