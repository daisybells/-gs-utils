import { POINTERS, SPLIT_CHARACTER, IGNORE_CHARACTER, } from "./console-format/constants.js";
import { clearRegex } from "../string/normalize.js";
import { makeFormatter } from "./console-format/create-formatter.js";
import { toColor, decorateString } from "./console-format/create-formatter.js";
import { applyFormatting, clearString, } from "./console-format/format-string.js";
function initializeColorFormatter() {
    const identifierRegex = createIdentifierRegex({
        pointers: POINTERS,
        split_character: SPLIT_CHARACTER,
        ignore_character: IGNORE_CHARACTER,
    });
    return {
        apply: (string) => applyFormatting(string, identifierRegex),
        format: makeFormatter,
        toColor,
        decorate: decorateString,
        clear: clearString,
    };
}
function createIdentifierRegex(options) {
    const { pointers, split_character, ignore_character } = options;
    const pointersRegex = Object.keys(pointers)
        .sort((a, b) => b.length - a.length)
        .map((value) => clearRegex(value))
        .join("|");
    const specifiersGroupRegex = `[a-z${clearRegex(split_character)}]+?`;
    const colorIdentifiersRegexString = `(${clearRegex(ignore_character)}){0,1}%(?:\\((${specifiersGroupRegex})\\)){0,1}(${pointersRegex})`;
    return new RegExp(colorIdentifiersRegexString, "gu");
}
export { initializeColorFormatter };
//# sourceMappingURL=console-format.js.map