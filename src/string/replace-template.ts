/**
 * Implementation of Javascript replacement templates to strings.
 * @param inputString String to be replaced.
 * @param replacer Key value pairs to use for replacer.
 * @returns
 */
function replaceTemplate(
    inputString: string,
    replacer: Record<string, string>,
): string {
    return inputString.replaceAll(
        /(\\){0,1}\$\{(.*?)\}/gu,
        (match: string, isEscaped: string, key: string): string => {
            if (isEscaped) {
                return match;
            }
            const value = replacer[key];
            if (value === undefined) {
                return "";
            }

            return value;
        },
    );
}

export { replaceTemplate };
