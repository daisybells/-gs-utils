import { reduceDecorationCodes, reduceEscapeCodes } from "./extractors.js";
import { addEscapesToString, createColorEscape } from "./generators.js";

import type {
    StringFormatter,
    ColorCode,
    DecorationCode,
    ColoredCLIString,
    ActiveEscapeCodes,
    ANSICode,
} from "@/types/console/console-format.js";

function makeFormatter(string: string): StringFormatter {
    return {
        toColor: (..._arguments: ColorCode[]): StringFormatter => {
            const outputString = toColor(string, ..._arguments);
            return makeFormatter(outputString);
        },
        decorate: (...decorations: DecorationCode[]): StringFormatter => {
            const outputString = decorateString(string, ...decorations);
            return makeFormatter(outputString);
        },
        toString: (): ColoredCLIString => string,
    };
}

function decorateString(
    string: string,
    ...decorations: DecorationCode[]
): ColoredCLIString {
    const decorationCodes = reduceDecorationCodes(decorations);
    return addEscapesToString(string, decorationCodes.join(""));
}
function toColor(string: string, ..._arguments: ColorCode[]): ColoredCLIString {
    const escapeCodes: ActiveEscapeCodes = reduceEscapeCodes(_arguments);
    const escapeSequence: ANSICode = createColorEscape(escapeCodes);

    return addEscapesToString(string, escapeSequence);
}
export { makeFormatter, decorateString, toColor };
