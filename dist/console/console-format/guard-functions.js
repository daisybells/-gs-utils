import { POINTERS, DECORATION_CODES, PRIMARY_CODES, BRIGHTNESS_CODES, FGBG_CODES, } from "./constants.js";
function isPointer(input) {
    return input in POINTERS;
}
function isDecorationCode(input) {
    return input in DECORATION_CODES;
}
function isPrimaryCode(input) {
    return input in PRIMARY_CODES;
}
function isBrightnessCode(input) {
    return input in BRIGHTNESS_CODES;
}
function isFgBgCode(input) {
    return input in FGBG_CODES;
}
function isColorCode(input) {
    return isPrimaryCode(input) && isBrightnessCode(input) && isFgBgCode(input);
}
export { isPointer, isDecorationCode, isPrimaryCode, isBrightnessCode, isFgBgCode, isColorCode, };
//# sourceMappingURL=guard-functions.js.map