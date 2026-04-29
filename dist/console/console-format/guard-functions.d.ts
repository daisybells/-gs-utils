import { POINTERS } from "./constants.js";
import type { DecorationCode, PrimaryCode, BrightnessCode, FgBgCode, ColorCode } from "../../types/console/console-format.js";
declare function isPointer(input: string): input is keyof typeof POINTERS;
declare function isDecorationCode(input: string): input is DecorationCode;
declare function isPrimaryCode(input: string): input is PrimaryCode;
declare function isBrightnessCode(input: string): input is BrightnessCode;
declare function isFgBgCode(input: string): input is FgBgCode;
declare function isColorCode(input: string): input is ColorCode;
export { isPointer, isDecorationCode, isPrimaryCode, isBrightnessCode, isFgBgCode, isColorCode, };
