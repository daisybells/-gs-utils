import { PRIMARY_CODES, BRIGHTNESS_CODES, FGBG_CODES, DECORATION_CODES, POINTERS } from "../../console/console-format/constants.js";
/**
 * String that contains ColorFormatter escape codes.
 */
export type ColorFormatterString = string;
/**
 * Invisible character code that formats terminal output.
 */
export type ANSICode = string;
/**
 * String that is formatted for CLI color output.
 */
export type ColoredCLIString = string;
export type PrimaryCode = keyof typeof PRIMARY_CODES;
export type BrightnessCode = keyof typeof BRIGHTNESS_CODES;
export type FgBgCode = keyof typeof FGBG_CODES;
/**
 * Map of lexical decoration to ANSI escape codes.
 */
export type DecorationCode = keyof typeof DECORATION_CODES;
/**
 * Map of lexical color and identifier codes to ANSI escape codes.
 */
export type ColorCode = PrimaryCode | BrightnessCode | FgBgCode;
export type CLIColorFormatter = {
    apply: (string: string) => ColoredCLIString;
    format: (string: string) => StringFormatter;
    toColor: any;
    decorate: any;
    clear: any;
};
export type StringFormatter = {
    toColor: (...args: ColorCode[]) => StringFormatter;
    decorate: (...args: DecorationCode[]) => StringFormatter;
    toString: () => string;
};
export type ActiveEscapeCodes = {
    color: string;
    brightness: string;
    fgbg: string;
};
export type CreateIdentifierRegexOptions = {
    pointers: typeof POINTERS;
    split_character: string;
    ignore_character: string;
};
