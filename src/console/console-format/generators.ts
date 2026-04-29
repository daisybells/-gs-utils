import { RESET, ESCAPE_CHARACTER } from "./constants.js";
import type {
    ActiveEscapeCodes,
    ANSICode,
    ColoredCLIString,
} from "@/types/console/console-format.js";

function getResetEscape() {
    return addEscapeToCode(RESET);
}

function addEscapeToCode(code: string): ColoredCLIString {
    return `${ESCAPE_CHARACTER}[${code}m`;
}

function addEscapesToString(string: string, escapes: ANSICode) {
    const coloredString = `${escapes}${string}`;
    if (!coloredString.endsWith(getResetEscape())) {
        return `${escapes}${string}${getResetEscape()}`;
    }
    return coloredString;
}

function createColorEscape(colorCodes: ActiveEscapeCodes): ANSICode {
    const { color, brightness, fgbg }: ActiveEscapeCodes = colorCodes;
    if (!color) {
        return "";
    }
    const escapeSequence = `${fgbg}${color}${brightness}`;
    return addEscapeToCode(escapeSequence);
}
export {
    addEscapeToCode,
    addEscapesToString,
    createColorEscape,
    getResetEscape,
};
