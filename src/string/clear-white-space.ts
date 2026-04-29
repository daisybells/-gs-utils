/**
 * Collapse all white space into singular space characters.
 * @param string
 * @returns
 */
function clearWhiteSpace(string: string = ""): string {
    return string.replaceAll(/[\t\n\v\f\r\s]{2,}/gu, " ").trim();
}
export { clearWhiteSpace };
