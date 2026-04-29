const PRIMARY_CODES = {
    black: "0",
    red: "1",
    green: "2",
    yellow: "3",
    blue: "4",
    magenta: "5",
    cyan: "6",
    white: "7",
} as const;

const BRIGHTNESS_CODES = {
    bright: ";1",
} as const;

const FGBG_CODES = {
    text: "3",
    highlight: "4",
} as const;
const DECORATION_CODES = {
    bold: "1",
    dim: "2",
    italic: "3",
    underline: "4",
    blink: "5",
    reverse: "7",
    hidden: "8",
    strikethrough: "9",
} as const;
const POINTERS = {
    f: "color",
    d: "decoration",
    r: "reset",
} as const;
const ESCAPE_CHARACTER = "\u001b";
const SPLIT_CHARACTER = ",";
const IGNORE_CHARACTER = "^";
const RESET = "0";

export {
    PRIMARY_CODES,
    BRIGHTNESS_CODES,
    FGBG_CODES,
    DECORATION_CODES,
    POINTERS,
    ESCAPE_CHARACTER,
    SPLIT_CHARACTER,
    IGNORE_CHARACTER,
    RESET,
};
