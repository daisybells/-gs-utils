import { reduceDecorationCodes, reduceEscapeCodes } from "./extractors.js";
import { addEscapesToString, createColorEscape } from "./generators.js";
function makeFormatter(string) {
    return {
        toColor: (..._arguments) => {
            const outputString = toColor(string, ..._arguments);
            return makeFormatter(outputString);
        },
        decorate: (...decorations) => {
            const outputString = decorateString(string, ...decorations);
            return makeFormatter(outputString);
        },
        toString: () => string,
    };
}
function decorateString(string, ...decorations) {
    const decorationCodes = reduceDecorationCodes(decorations);
    return addEscapesToString(string, decorationCodes.join(""));
}
function toColor(string, ..._arguments) {
    const escapeCodes = reduceEscapeCodes(_arguments);
    const escapeSequence = createColorEscape(escapeCodes);
    return addEscapesToString(string, escapeSequence);
}
export { makeFormatter, decorateString, toColor };
