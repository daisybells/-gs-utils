import type { ActiveEscapeCodes, ANSICode, ColoredCLIString } from "../../types/console/console-format.js";
declare function getResetEscape(): string;
declare function addEscapeToCode(code: string): ColoredCLIString;
declare function addEscapesToString(string: string, escapes: ANSICode): string;
declare function createColorEscape(colorCodes: ActiveEscapeCodes): ANSICode;
export { addEscapeToCode, addEscapesToString, createColorEscape, getResetEscape, };
