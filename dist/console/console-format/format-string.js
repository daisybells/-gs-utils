import { IGNORE_CHARACTER, SPLIT_CHARACTER, POINTERS, RESET, } from "./constants.js";
import { isPointer } from "./guard-functions.js";
import { reduceEscapeCodes, reduceDecorationCodes } from "./extractors.js";
import { addEscapeToCode, createColorEscape, getResetEscape, } from "./generators.js";
function applyFormatting(string, regex) {
    const coloredString = string.replaceAll(regex, transformMatch);
    return `${coloredString}${getResetEscape()}`;
}
function clearString(string, regex) {
    return string.replaceAll(regex, (match) => {
        return `${IGNORE_CHARACTER}${match}`;
    });
}
function transformMatch(match, ignored, specifiers, pointer) {
    const isIgnored = ignored === IGNORE_CHARACTER;
    const hasSpecifiers = typeof specifiers === "string" && specifiers.trim() !== "";
    if (isIgnored) {
        return match.replace(IGNORE_CHARACTER, "");
    }
    if (!isPointer(pointer)) {
        return match;
    }
    const type = POINTERS[pointer];
    if (!type) {
        return match;
    }
    const specifiersArray = hasSpecifiers
        ? specifiers.split(SPLIT_CHARACTER)
        : [];
    switch (type) {
        case "reset": {
            return addEscapeToCode(RESET);
        }
        case "decoration": {
            const decorationCodes = reduceDecorationCodes(specifiersArray);
            return decorationCodes.join("");
        }
        case "color": {
            const escapeCodes = reduceEscapeCodes(specifiersArray);
            return createColorEscape(escapeCodes);
        }
        default:
            return match;
    }
}
export { transformMatch, applyFormatting, clearString };
//# sourceMappingURL=format-string.js.map