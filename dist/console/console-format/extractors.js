import { FGBG_CODES, RESET, PRIMARY_CODES, BRIGHTNESS_CODES, DECORATION_CODES, } from "./constants.js";
import { isPrimaryCode, isFgBgCode, isBrightnessCode, isDecorationCode, } from "./guard-functions.js";
import { addEscapeToCode } from "./generators.js";
function reduceEscapeCodes(specifiersArray) {
    const defaultCodes = {
        color: "",
        brightness: "",
        fgbg: FGBG_CODES.text,
    };
    return specifiersArray.reduce((accumulator, currentValue) => trackEscapeCode(accumulator, currentValue), defaultCodes);
}
function trackEscapeCode(accumulator, currentEscapeCode) {
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
function reduceDecorationCodes(specifiersArray) {
    return specifiersArray.reduce((accumulator, specifier) => {
        if (!isDecorationCode(specifier)) {
            return accumulator;
        }
        const decorationCode = DECORATION_CODES[specifier];
        return [...accumulator, addEscapeToCode(decorationCode)];
    }, []);
}
export { reduceEscapeCodes, reduceDecorationCodes, trackEscapeCode };
//# sourceMappingURL=extractors.js.map