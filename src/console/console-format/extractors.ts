import {
    FGBG_CODES,
    RESET,
    PRIMARY_CODES,
    BRIGHTNESS_CODES,
    DECORATION_CODES,
} from "./constants.js";
import {
    isPrimaryCode,
    isFgBgCode,
    isBrightnessCode,
    isDecorationCode,
} from "./guard-functions.js";
import { addEscapeToCode } from "./generators.js";

import type {
    ActiveEscapeCodes,
    ColoredCLIString,
} from "@/types/console/console-format.js";

function reduceEscapeCodes(specifiersArray: string[]): ActiveEscapeCodes {
    const defaultCodes: ActiveEscapeCodes = {
        color: "",
        brightness: "",
        fgbg: FGBG_CODES.text,
    };
    return specifiersArray.reduce(
        (accumulator, currentValue) =>
            trackEscapeCode(accumulator, currentValue),
        defaultCodes,
    );
}
function trackEscapeCode(
    accumulator: ActiveEscapeCodes,
    currentEscapeCode: string,
): ActiveEscapeCodes {
    switch (true) {
        case accumulator.color === RESET:
            return accumulator;
        case isPrimaryCode(currentEscapeCode):
            return {
                ...accumulator,
                color: PRIMARY_CODES[currentEscapeCode],
            };
        case isFgBgCode(currentEscapeCode):
            return {
                ...accumulator,
                fgbg: FGBG_CODES[currentEscapeCode],
            };
        case isBrightnessCode(currentEscapeCode):
            return {
                ...accumulator,
                brightness: BRIGHTNESS_CODES[currentEscapeCode],
            };
        default:
            return accumulator;
    }
}
function reduceDecorationCodes(specifiersArray: string[]): ColoredCLIString[] {
    return specifiersArray.reduce(
        (
            accumulator: ColoredCLIString[],
            specifier: string,
        ): ColoredCLIString[] => {
            if (!isDecorationCode(specifier)) {
                return accumulator;
            }
            const decorationCode: string = DECORATION_CODES[specifier];
            return [...accumulator, addEscapeToCode(decorationCode)];
        },
        [],
    );
}

export { reduceEscapeCodes, reduceDecorationCodes, trackEscapeCode };
