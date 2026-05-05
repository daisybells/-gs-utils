import { clearRegex } from "./normalize.js";
import type { DataMap, CFormatter, CFormatString } from "../types/string.js";

/**
 * Initialize instance of C-Like Formatter.
 * @param dataMap Map of character identifiers and their given value.
 * @returns
 */
function initializeCFormatter(dataMap: DataMap): CFormatter {
    const PAD_START_REGEX: string = "[^\\.]{0,1}\\d+?";
    const TO_FIXED_REGEX: string = "\\.(\\d+?";
    const FORMAT_SPECIFIER_REGEX: string = `%(${PAD_START_REGEX}){0,1}(?:${TO_FIXED_REGEX})){0,1}`;
    const clearedDataMap: DataMap = {
        "%": "%",
        ...dataMap,
    };
    const dataMapStrings = Object.keys(clearedDataMap)
        .sort((a, b) => b.length - a.length)
        .map(clearRegex)
        .join("|");
    const regex = new RegExp(
        `${FORMAT_SPECIFIER_REGEX}(${dataMapStrings}){0,1}`,
        "gu",
    );
    return {
        clear: (input: CFormatString): string => {
            return input.replaceAll("%", "%%");
        },
        apply: (input: CFormatString): string => {
            return input.replaceAll(
                regex,
                (
                    match: string,
                    minLengthSpecifier: string,
                    orderSpecifier: string,
                    dataType,
                ) => {
                    const hasDataType =
                        typeof dataType === "string" && dataType.trim() !== "";
                    if (!hasDataType) {
                        return match;
                    }

                    const output: string = String(clearedDataMap[dataType]);

                    if (match.length === 2) {
                        return output;
                    }
                    return formatNumber(
                        output,
                        minLengthSpecifier,
                        orderSpecifier,
                    );
                },
            );
        },
    };
}

function formatNumber(
    inputNumber: string,
    minLengthSpecifier: string,
    orderSpecifier: string,
): string {
    return formatMinLength(
        formatOrder(inputNumber, orderSpecifier),
        minLengthSpecifier,
    );
}

function formatMinLength(
    inputNumber: string,
    minLengthSpecifier: string,
): string {
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

function formatOrder(inputNumber: string, orderSpecifier: string): string {
    if (!orderSpecifier) {
        return inputNumber;
    }
    const order: number = Number.parseInt(orderSpecifier, 10);
    const input: number = Number.parseFloat(inputNumber);

    return input.toFixed(order);
}

export { initializeCFormatter };
