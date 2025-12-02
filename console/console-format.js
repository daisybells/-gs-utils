function initializeColorFormat() {
    const ESCAPE_CHARACTER = "\u001b";
    const SPLIT_CHARACTER = ",";

    const RESET = "0";
    const RESET_ESCAPE = addEscapeToCode(RESET);

    const colorCodes = {
        black: "0",
        red: "1",
        green: "2",
        yellow: "3",
        blue: "4",
        magenta: "5",
        cyan: "6",
        white: "7",
        reset: RESET,
    };
    const brightnessCodes = {
        bright: ";1",
    };
    const decorationCodes = {
        bold: "1",
        dim: "2",
        italic: "3",
        underline: "4",
        blink: "5",
        reversed: "7",
        hidden: "8",
        strikethrough: "9",
    };
    const fgbgCodes = {
        text: "3",
        highlight: "4",
    };
    const selectorRegex = /%(i){0,1}\(([a-z,]+?)\)([fd])/gu;

    return {
        apply: applyFormatting,
        format: makeFormatter,
        toColor,
        decorate: decorateString,
        clear: clearString,
    };

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
        const decorationCodes = extractDecorationCodes(decorations);
        return addEscapesToString(string, decorationCodes.join(""));
    }

    function toColor(string, color, brightness, highlight) {
        const escapeCodes = {
            color: colorCodes[color] || RESET,
            brightness: brightnessCodes[brightness] || "",
            fgbg: fgbgCodes[highlight] || fgbgCodes["text"],
        };
        const escapeSequence = createEscapeSequence(escapeCodes);

        return addEscapesToString(string, escapeSequence);
    }

    function clearString(string) {
        return string.replaceAll(selectorRegex, (match, ignored) => {
            const isIgnored = ignored === "i";
            if (isIgnored) return match;
            return `${match.charAt(0)}i${match.slice(1)}`;
        });
    }
    function applyFormatting(string) {
        const coloredString = string.replaceAll(
            selectorRegex,
            (match, ignored, specifiers, type) => {
                if (ignored === "i") return match.replace("i", "");
                const specifiersArray = specifiers.split(SPLIT_CHARACTER);
                if (type === "d") {
                    const decorationCodes =
                        extractDecorationCodes(specifiersArray);
                    return decorationCodes.join("");
                }

                if (!specifiers) return match;
                const escapeCodes = extractEscapeCodes(specifiersArray);
                const { color } = escapeCodes;
                if (!color) return match;
                return createEscapeSequence(escapeCodes);
            }
        );
        return `${coloredString}${RESET_ESCAPE}`;
    }

    function createEscapeSequence(escapeCodes) {
        const { color, brightness, fgbg } = escapeCodes;
        if (!color) return "";
        const escapeSequence = `${fgbg}${color}${brightness}`;
        return addEscapeToCode(escapeSequence);
    }

    function extractDecorationCodes(specifiersArray) {
        return specifiersArray.reduce((accumulator, specifier) => {
            console.log(specifier);
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

export { initializeColorFormat };
