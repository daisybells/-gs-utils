import { POINTERS, DECORATION_CODES, PRIMARY_CODES, BRIGHTNESS_CODES, FGBG_CODES, } from "./constants.js";
function isPointer(input) {
    return Object.hasOwn(POINTERS, input);
}
function isDecorationCode(input) {
    return Object.hasOwn(DECORATION_CODES, input);
}
function isPrimaryCode(input) {
    return Object.hasOwn(PRIMARY_CODES, input);
}
function isBrightnessCode(input) {
    return Object.hasOwn(BRIGHTNESS_CODES, input);
}
function isFgBgCode(input) {
    return Object.hasOwn(FGBG_CODES, input);
}
function isColorCode(input) {
    return isPrimaryCode(input) && isBrightnessCode(input) && isFgBgCode(input);
}
export { isPointer, isDecorationCode, isPrimaryCode, isBrightnessCode, isFgBgCode, isColorCode, };
