import { clearRegex } from "./normalize.js";

function initializeCFormatter(dataMap) {
    const PAD_START_REGEX = "[^\\.]{0,1}\\d+?";
    const TO_FIXED_REGEX = "\\.(\\d+?";
    const FORMAT_SPECIFIER_REGEX = `%(${PAD_START_REGEX}){0,1}(?:${TO_FIXED_REGEX})){0,1}`;
    const clearedDataMap = {
        ...dataMap,
        "%": "%",
    };
    const dataMapStrings = Object.keys(clearedDataMap)
        .sort((a, b) => b.length - a.length)
        .map(clearRegex)
        .join("|");
    const regex = new RegExp(
        `${FORMAT_SPECIFIER_REGEX}(${dataMapStrings})`,
        "gu"
    );
    console.log(regex);
    return {
        apply: (input) => {
            return input.replaceAll(
                regex,
                (match, minLength, order, dataType) => {
                    const output = clearedDataMap[dataType];
                    if (match.length === 2) return output;
                    return formatNumber(output, minLength, order);
                }
            );
        },
    };
}
function formatNumber(inputNumber, minLength, order) {
    return formatMinLength(formatOrder(inputNumber, order), minLength);
}

function formatMinLength(inputNumber, minLengthString) {
    if (minLengthString === undefined) return String(inputNumber);

    const padCharacterMatch = minLengthString.match(/^[^1-9]/u);
    const padCharacter = padCharacterMatch ? padCharacterMatch[0] : " ";

    const minLength = padCharacterMatch
        ? Number.parseInt(minLengthString.slice(1))
        : Number.parseInt(minLengthString);

    return String(inputNumber).padStart(minLength, padCharacter);
}
function formatOrder(inputNumber, orderString) {
    if (orderString === undefined) return String(inputNumber);
    const order = Number.parseInt(orderString);

    return String(inputNumber.toFixed(order));
}

export { initializeCFormatter };
