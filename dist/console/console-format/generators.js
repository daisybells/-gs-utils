import { RESET, ESCAPE_CHARACTER } from "./constants.js";
function getResetEscape() {
    return addEscapeToCode(RESET);
}
function addEscapeToCode(code) {
    return `${ESCAPE_CHARACTER}[${code}m`;
}
function addEscapesToString(string, escapes) {
    const coloredString = `${escapes}${string}`;
    if (!coloredString.endsWith(getResetEscape())) {
        return `${escapes}${string}${getResetEscape()}`;
    }
    return coloredString;
}
function createColorEscape(colorCodes) {
    const { color, brightness, fgbg } = colorCodes;
    if (!color) {
        return "";
    }
    const escapeSequence = `${fgbg}${color}${brightness}`;
    return addEscapeToCode(escapeSequence);
}
export { addEscapeToCode, addEscapesToString, createColorEscape, getResetEscape, };
//# sourceMappingURL=generators.js.map