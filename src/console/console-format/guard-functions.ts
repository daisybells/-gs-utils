import {
    POINTERS,
    DECORATION_CODES,
    PRIMARY_CODES,
    BRIGHTNESS_CODES,
    FGBG_CODES,
} from "./constants.js";

import type {
    DecorationCode,
    PrimaryCode,
    BrightnessCode,
    FgBgCode,
    ColorCode,
} from "@/types/console/console-format.js";

function isPointer(input: string): input is keyof typeof POINTERS {
    return input in POINTERS;
}
function isDecorationCode(input: string): input is DecorationCode {
    return input in DECORATION_CODES;
}
function isPrimaryCode(input: string): input is PrimaryCode {
    return input in PRIMARY_CODES;
}

function isBrightnessCode(input: string): input is BrightnessCode {
    return input in BRIGHTNESS_CODES;
}
function isFgBgCode(input: string): input is FgBgCode {
    return input in FGBG_CODES;
}
function isColorCode(input: string): input is ColorCode {
    return isPrimaryCode(input) && isBrightnessCode(input) && isFgBgCode(input);
}
export {
    isPointer,
    isDecorationCode,
    isPrimaryCode,
    isBrightnessCode,
    isFgBgCode,
    isColorCode,
};
