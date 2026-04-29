declare const PRIMARY_CODES: {
    readonly black: "0";
    readonly red: "1";
    readonly green: "2";
    readonly yellow: "3";
    readonly blue: "4";
    readonly magenta: "5";
    readonly cyan: "6";
    readonly white: "7";
};
declare const BRIGHTNESS_CODES: {
    readonly bright: ";1";
};
declare const FGBG_CODES: {
    readonly text: "3";
    readonly highlight: "4";
};
declare const DECORATION_CODES: {
    readonly bold: "1";
    readonly dim: "2";
    readonly italic: "3";
    readonly underline: "4";
    readonly blink: "5";
    readonly reverse: "7";
    readonly hidden: "8";
    readonly strikethrough: "9";
};
declare const POINTERS: {
    readonly f: "color";
    readonly d: "decoration";
    readonly r: "reset";
};
declare const ESCAPE_CHARACTER = "\u001B";
declare const SPLIT_CHARACTER = ",";
declare const IGNORE_CHARACTER = "^";
declare const RESET = "0";
export { PRIMARY_CODES, BRIGHTNESS_CODES, FGBG_CODES, DECORATION_CODES, POINTERS, ESCAPE_CHARACTER, SPLIT_CHARACTER, IGNORE_CHARACTER, RESET, };
