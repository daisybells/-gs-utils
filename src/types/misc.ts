// DEBOUNCE
export type Promisify<T extends (...args: any[]) => any> = T extends (
    ...args: infer A
) => infer R
    ? (...args: A) => Promise<Awaited<R>>
    : never;
