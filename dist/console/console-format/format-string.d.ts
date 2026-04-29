import type { ColoredCLIString, ColorFormatterString } from "../../types/console/console-format.js";
declare function applyFormatting(string: ColorFormatterString, regex: RegExp): ColoredCLIString;
declare function clearString(string: ColoredCLIString, regex: RegExp): string;
declare function transformMatch(match: string, ignored: string, specifiers: string, pointer: string): string;
export { transformMatch, applyFormatting, clearString };
