/**
 * Implementation of Javascript replacement templates to strings.
 * @param inputString String to be replaced.
 * @param replacer Key value pairs to use for replacer.
 * @returns
 */
declare function replaceTemplate(inputString: string, replacer: Record<string, string>): string;
export { replaceTemplate };
