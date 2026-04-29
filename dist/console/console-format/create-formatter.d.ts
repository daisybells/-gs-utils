import type { StringFormatter, ColorCode, DecorationCode, ColoredCLIString } from "../../types/console/console-format.js";
declare function makeFormatter(string: string): StringFormatter;
declare function decorateString(string: string, ...decorations: DecorationCode[]): ColoredCLIString;
declare function toColor(string: string, ..._arguments: ColorCode[]): ColoredCLIString;
export { makeFormatter, decorateString, toColor };
