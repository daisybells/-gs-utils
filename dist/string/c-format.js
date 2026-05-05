import { clearRegex } from "./normalize.js";
/**
 * Initialize instance of C-Like Formatter.
 * @param dataMap Map of character identifiers and their given value.
 * @returns
 */
function initializeCFormatter(dataMap) {
    const PAD_START_REGEX = "[^\\.]{0,1}\\d+?";
    const TO_FIXED_REGEX = "\\.(\\d+?";
    const FORMAT_SPECIFIER_REGEX = `%(${PAD_START_REGEX}){0,1}(?:${TO_FIXED_REGEX})){0,1}`;
    const clearedDataMap = {
        "%": "%",
        ...dataMap,
    };
    const dataMapStrings = Object.keys(clearedDataMap)
        .sort((a, b) => b.length - a.length)
        .map(clearRegex)
        .join("|");
    const regex = new RegExp(`${FORMAT_SPECIFIER_REGEX}(${dataMapStrings}){0,1}`, "gu");
    return {
        clear: (input) => {
            return input.replaceAll("%", "%%");
        },
        apply: (input) => {
            return input.replaceAll(regex, (match, minLengthSpecifier, orderSpecifier, dataType) => {
                const hasDataType = typeof dataType === "string" && dataType.trim() !== "";
                if (!hasDataType) {
                    return match;
                }
                const output = String(clearedDataMap[dataType]);
                if (match.length === 2) {
                    return output;
                }
                return formatNumber(output, minLengthSpecifier, orderSpecifier);
            });
        },
    };
}
function formatNumber(inputNumber, minLengthSpecifier, orderSpecifier) {
    return formatMinLength(formatOrder(inputNumber, orderSpecifier), minLengthSpecifier);
}
function formatMinLength(inputNumber, minLengthSpecifier) {
    if (!minLengthSpecifier) {
        return inputNumber;
    }
    const padCharacterMatch = minLengthSpecifier.match(/^[^1-9]/u);
    const padCharacter = padCharacterMatch ? padCharacterMatch[0] : " ";
    const minLength = padCharacterMatch
        ? Number.parseInt(minLengthSpecifier.slice(1), 10)
        : Number.parseInt(minLengthSpecifier, 10);
    return inputNumber.padStart(minLength, padCharacter);
}
function formatOrder(inputNumber, orderSpecifier) {
    if (!orderSpecifier) {
        return inputNumber;
    }
    const order = Number.parseInt(orderSpecifier, 10);
    const input = Number.parseFloat(inputNumber);
    return input.toFixed(order);
}
export { initializeCFormatter };
