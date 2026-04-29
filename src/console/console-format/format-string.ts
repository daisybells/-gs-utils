import {
    IGNORE_CHARACTER,
    SPLIT_CHARACTER,
    POINTERS,
    RESET,
} from "./constants.js";
import { isPointer } from "./guard-functions.js";
import { reduceEscapeCodes, reduceDecorationCodes } from "./extractors.js";
import {
    addEscapeToCode,
    createColorEscape,
    getResetEscape,
} from "./generators.js";

import type {
    ColoredCLIString,
    ActiveEscapeCodes,
    ColorFormatterString,
} from "@/types/console/console-format.js";

function applyFormatting(
    string: ColorFormatterString,
    regex: RegExp,
): ColoredCLIString {
    const coloredString: ColoredCLIString = string.replaceAll(
        regex,
        transformMatch,
    );
    return `${coloredString}${getResetEscape()}`;
}
function clearString(string: ColoredCLIString, regex: RegExp): string {
    return string.replaceAll(regex, (match) => {
        return `${IGNORE_CHARACTER}${match}`;
    });
}
function transformMatch(
    match: string,
    ignored: string,
    specifiers: string,
    pointer: string,
): string {
    const isIgnored: boolean = ignored === IGNORE_CHARACTER;
    const hasSpecifiers: boolean =
        typeof specifiers === "string" && specifiers.trim() !== "";

    if (isIgnored) {
        return match.replace(IGNORE_CHARACTER, "");
    }
    if (!isPointer(pointer)) {
        return match;
    }

    const type: string | undefined = POINTERS[pointer];

    if (!type) {
        return match;
    }

    const specifiersArray: string[] = hasSpecifiers
        ? specifiers.split(SPLIT_CHARACTER)
        : [];

    switch (type) {
        case "reset": {
            return addEscapeToCode(RESET);
        }
        case "decoration": {
            const decorationCodes: ColoredCLIString[] =
                reduceDecorationCodes(specifiersArray);
            return decorationCodes.join("");
        }
        case "color": {
            const escapeCodes: ActiveEscapeCodes =
                reduceEscapeCodes(specifiersArray);
            return createColorEscape(escapeCodes);
        }
        default:
            return match;
    }
}

export { transformMatch, applyFormatting, clearString };
