import {
    POINTERS,
    SPLIT_CHARACTER,
    IGNORE_CHARACTER,
} from "./console-format/constants.js";

import { clearRegex } from "../string/normalize.js";
import {
    makeFormatter,
    toColor,
    decorateString,
} from "./console-format/create-formatter.js";
import {
    applyFormatting,
    clearString,
} from "./console-format/format-string.js";

import type {
    CLIColorFormatter,
    ColoredCLIString,
    CreateIdentifierRegexOptions,
    ColorFormatterString,
} from "@/types/console/console-format.js";

function initializeColorFormatter(): CLIColorFormatter {
    const identifierRegex = createIdentifierRegex({
        pointers: POINTERS,
        split_character: SPLIT_CHARACTER,
        ignore_character: IGNORE_CHARACTER,
    });
    return {
        apply: (string: ColorFormatterString): ColoredCLIString =>
            applyFormatting(string, identifierRegex),
        format: makeFormatter,
        toColor,
        decorate: decorateString,
        clear: (string: string): string => clearString(string, identifierRegex),
    };
}

function createIdentifierRegex(options: CreateIdentifierRegexOptions): RegExp {
    const { pointers, split_character, ignore_character } = options;

    const pointersRegex: string = Object.keys(pointers)
        .sort((a, b) => b.length - a.length)
        .map((value: string): string => clearRegex(value))
        .join("|");

    const specifiersGroupRegex: string = `[a-z${clearRegex(split_character)}]+?`;

    const colorIdentifiersRegexString: string = `(${clearRegex(
        ignore_character,
    )}){0,1}%(?:\\((${specifiersGroupRegex})\\)){0,1}(${pointersRegex})`;

    return new RegExp(colorIdentifiersRegexString, "gu");
}

export { initializeColorFormatter };
