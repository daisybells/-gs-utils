import { clearRegex } from "./normalize.js";

/**
 * @typedef {String} CFormatString - String with percent (%) codes to be
 * replaced by values within the input dataMap.
 *
 * @typedef {{[key: string]: any}} DataMap - Key-value pairs that determine
 * the output data for any given a specifier.
 */

/**
 * @callback ApplyFormatting - Applies C-Formatting to input string.
 * @param {CFormatString} input - String with percent (%) codes to be replaced.
 * @returns {String} - String with formatted output.
 *
 * @callback ClearFormatting - Clears a string from being
 * @param {CFormatString} input - Data to be cleared.
 * @returns {String} - Cleared string to prevent Apply conflicts.
 *
 */

/**
 *
 * @typedef {{
 * apply: ApplyFormatting,
 * clear: ClearFormatting
 * }} CTextFormatter
 *
 */

/**
 * @param {DataMap} dataMap - Object that determines the key-value map for
 * changing data.
 * @returns {CTextFormatter}
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
    const regex = new RegExp(
        `${FORMAT_SPECIFIER_REGEX}(${dataMapStrings}){0,1}`,
        "gu"
    );
    return {
        clear: (input) => {
            return input.replaceAll("%", "%%");
        },
        apply: (input) => {
            return input.replaceAll(
                regex,
                (match, minLength, order, dataType) => {
                    const hasDataType =
                        typeof dataType === "string" && dataType.trim() !== "";
                    if (!hasDataType) {
                        return match;
                    }

                    const output = clearedDataMap[dataType];
                    if (match.length === 2) return output;
                    return formatNumber(output, minLength, order);
                }
            );
        },
    };
}
/**
 *
 * @param {Number} inputNumber
 * @param {String} minLength
 * @param {String} order
 * @returns
 */
function formatNumber(inputNumber, minLength, order) {
    return formatMinLength(formatOrder(inputNumber, order), minLength);
}
/**
 *
 * @param {String} inputNumber
 * @param {String} minLengthString
 * @returns {String}
 */
function formatMinLength(inputNumber, minLengthString) {
    if (minLengthString === undefined) return String(inputNumber);

    const padCharacterMatch = minLengthString.match(/^[^1-9]/u);
    const padCharacter = padCharacterMatch ? padCharacterMatch[0] : " ";

    const minLength = padCharacterMatch
        ? Number.parseInt(minLengthString.slice(1))
        : Number.parseInt(minLengthString);

    return String(inputNumber).padStart(minLength, padCharacter);
}
/**
 *
 * @param {Number} inputNumber
 * @param {String} orderString
 * @returns {String}
 */
function formatOrder(inputNumber, orderString) {
    if (orderString === undefined) return String(inputNumber);
    const order = Number.parseInt(orderString);

    return String(inputNumber.toFixed(order));
}

export { initializeCFormatter };
