import { clearRegex } from "../string/normalize.js";

const colorCodes = {
    black: "0",
    red: "1",
    green: "2",
    yellow: "3",
    blue: "4",
    magenta: "5",
    cyan: "6",
    white: "7",
};

const brightnessCodes = {
    bright: ";1",
};

const fgbgCodes = {
    text: "3",
    highlight: "4",
};

const decorationCodes = {
    bold: "1",
    dim: "2",
    italic: "3",
    underline: "4",
    blink: "5",
    reverse: "7",
    hidden: "8",
    strikethrough: "9",
};

/**
 * @typedef {String} EscapedColorString - String that contains ColorFormatter escape codes.
 *
 * @typedef {String} ColoredCLIString - String that is formatted for CLI color output.
 *
 */

/**
 * @typedef {typeof colorCodes} ColorCodes - Map of lexical colors to ANSI escape codes.
 *
 * @typedef {typeof brightnessCodes} BrightnessCodes - Map of lexical brightness to ANSI escape codes.
 * @typedef {typeof fgbgCodes} FgbgCodes - Map of lexical FG/BG markers to ANSI escape codes.
 *
 * @typedef {typeof decorationCodes} DecorationCodes - Map of lexical decoration to ANSI escape codes.
 *
 * UNIONS
 * @typedef {(
 * keyof ColorCodes|
 * keyof BrightnessCodes|
 * keyof FgbgCodes)} ColorCode
 *
 * @typedef {(keyof DecorationCodes)} DecorationCode
 */

/**
 * @typedef {Object} StringFormatter - Object with methods to format an inputted string.
 * @property {ChangeFormatterColor} toColor - Change the color of the formatter instance.
 * @property {DecorateFormatter} decorate - Add text decoration to the formatter instance.
 * @property {FormatterToString} toString - Convert formatter back to a string value.
 *
 *
 * @callback ChangeFormatterColor - Convert the formatter string to a specific color.
 * @param {...ColorCode} Colors - Input values to change the color of the string
 * within the StringFormatter instance.
 * @returns {StringFormatter}
 *
 * @callback DecorateFormatter - Add text decoration to a string.
 * @param {...DecorationCode} Decorations - Input values to add decorations
 * to the string within the StringFormatter instance.
 * @returns {StringFormatter}
 * @callback FormatterToString - Convert StringFormatter back to its initial string value.
 * @returns {ColoredCLIString}
 */

/**
 *
 * @callback ApplyColorFormat
 * @param {EscapedColorString} - String with ColorFormatter escape codes.
 * @returns {ColoredCLIString} - Colored output CLI string.
 *
 * @callback StringToFormatter - Convert string to a StringFormatter Object
 * @param {String} - String to be formatted
 * @returns {StringFormatter}
 *
 * @callback ColorString - Convert an input string to a specific color.
 * @param {string} string - Input string to be changed.
 * @param {...ColorCode} Colors - Color code parameters.
 * @returns {ColoredCLIString}
 *
 * @callback DecorateString - Convert input string with specific decoration parameters.
 * @param {String} string - Input string to be transformed.
 * @param {...DecorationCode} Decorations - Decoration parameters.
 * @returns {ColoredCLIString}
 *
 * @typedef {Object} ColorFormat - Object with color formatting methods.
 * @property {ApplyColorFormat} apply - Apply function for escaped strings.
 * @property {StringToFormatter} format - Convert string to formatter instance.
 * @property {ColorString} toColor
 *
 */
/**
 * Initializes current instance of a CLI Color formatter.
 * @returns {ColorFormat}
 */
function initializeColorFormatter() {
    const ESCAPE_CHARACTER = "\u001b";
    const SPLIT_CHARACTER = ",";
    const IGNORE_CHARACTER = "^";

    const RESET = "0";
    const RESET_ESCAPE = addEscapeToCode(RESET);

    const pointers = {
        f: "color",
        d: "decoration",
        r: "reset",
    };

    const pointerSelectors = Object.keys(pointers)
        .sort((a, b) => b.length - a.length)
        .map(clearRegex)
        .join("|");

    const specifiersGroup = `[a-z${clearRegex(SPLIT_CHARACTER)}]+?`;

    const selectorRegexString = `(${clearRegex(
        IGNORE_CHARACTER
    )}){0,1}%(?:\\((${specifiersGroup})\\)){0,1}(${pointerSelectors})`;

    const selectorRegex = new RegExp(selectorRegexString, "gu");

    return {
        apply: applyFormatting,
        format: makeFormatter,
        toColor,
        decorate: decorateString,
        clear: clearString,
    };
    /** @type {FormatterToString} */
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

    /** @type {DecorateString} */
    function decorateString(string, ...decorations) {
        const decorationCodes = extractDecorationCodes(decorations);
        return addEscapesToString(string, decorationCodes.join(""));
    }

    /** @type {ColorString} */
    function toColor(string, ..._arguments) {
        const escapeCodes = extractEscapeCodes(_arguments);
        const escapeSequence = createColorEscape(escapeCodes);

        return addEscapesToString(string, escapeSequence);
    }

    function clearString(string) {
        return string.replaceAll(selectorRegex, (match) => {
            return `${IGNORE_CHARACTER}${match}`;
        });
    }

    /** @type {ApplyColorFormat} */
    function applyFormatting(string) {
        const coloredString = string.replaceAll(selectorRegex, transformString);
        return `${coloredString}${RESET_ESCAPE}`;
    }

    function transformString(match, ignored, specifiers, pointer) {
        const isIgnored = ignored === IGNORE_CHARACTER;
        const hasSpecifiers =
            typeof specifiers === "string" && specifiers.trim() !== "";

        if (isIgnored) return match.replace(IGNORE_CHARACTER, "");
        const type = pointers[pointer];

        const specifiersArray = hasSpecifiers
            ? specifiers.split(SPLIT_CHARACTER)
            : [];

        switch (type) {
            case "reset": {
                return RESET_ESCAPE;
            }
            case "decoration": {
                const decorationCodes = extractDecorationCodes(specifiersArray);
                return decorationCodes.join("");
            }
            case "color": {
                const escapeCodes = extractEscapeCodes(specifiersArray);
                return createColorEscape(escapeCodes);
            }
        }
    }

    function createColorEscape(escapeCodes) {
        const { color, brightness, fgbg } = escapeCodes;
        if (!color) return "";
        const escapeSequence = `${fgbg}${color}${brightness}`;
        return addEscapeToCode(escapeSequence);
    }

    function extractDecorationCodes(specifiersArray) {
        return specifiersArray.reduce((accumulator, specifier) => {
            const decorationCode = decorationCodes[specifier];
            if (!decorationCode) return accumulator;
            return [...accumulator, addEscapeToCode(decorationCode)];
        }, []);
    }

    function extractEscapeCodes(specifiersArray) {
        return specifiersArray.reduce(trackEscapeCode, {
            color: "",
            brightness: "",
            fgbg: fgbgCodes.text,
        });
    }
    function trackEscapeCode(accumulator, currentValue) {
        if (accumulator.color === RESET) return accumulator;
        const colorCode = colorCodes[currentValue];
        if (colorCode) {
            return {
                ...accumulator,
                color: colorCode,
            };
        }
        const fgbgCode = fgbgCodes[currentValue];
        if (fgbgCode) {
            return {
                ...accumulator,
                fgbg: fgbgCode,
            };
        }

        const brightnessCode = brightnessCodes[currentValue];
        if (brightnessCode) {
            return {
                ...accumulator,
                brightness: brightnessCode,
            };
        }
        return accumulator;
    }

    function addEscapeToCode(code) {
        return `${ESCAPE_CHARACTER}[${code}m`;
    }

    function addEscapesToString(string, escapes) {
        const coloredString = `${escapes}${string}`;
        if (!coloredString.endsWith(RESET_ESCAPE)) {
            return `${escapes}${string}${RESET_ESCAPE}`;
        }
        return coloredString;
    }
}

export { initializeColorFormatter };
