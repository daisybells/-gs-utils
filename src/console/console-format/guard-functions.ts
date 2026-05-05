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
    return Object.hasOwn(POINTERS, input);
}
function isDecorationCode(input: string): input is DecorationCode {
    return Object.hasOwn(DECORATION_CODES, input);
}
function isPrimaryCode(input: string): input is PrimaryCode {
    return Object.hasOwn(PRIMARY_CODES, input);
}

function isBrightnessCode(input: string): input is BrightnessCode {
    return Object.hasOwn(BRIGHTNESS_CODES, input);
}
function isFgBgCode(input: string): input is FgBgCode {
    return Object.hasOwn(FGBG_CODES, input);
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
