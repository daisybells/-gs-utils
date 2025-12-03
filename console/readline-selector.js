import { initializeColorFormatter } from "./console-format.js";
import { truncate } from "../string/basic.js";

/**
 * @typedef Answer
 * @property {Number} index - Index of chosen answer. Returns -1 if cancelled.
 * @property {never} value - Value from chosen answer.
 *
 * @typedef {[string, any]} SelectorEntry - Display string and output value.
 *
 * @typedef {Object} SelectorInterface
 * @property {AskQuestion} question
 * @property {function(): void} close - Exit selector interface.
 * @property {function(): void} clear - Clear terminal input of last written question.
 *
 * @callback AskQuestion
 * @param {String} prompt - Question to prompt the user with.
 * @param {SelectorEntry[]} listEntries - Entries to use for question.
 * @returns {Promise<Answer>}
 */

/**
 * Initialize a CLI selector interface.
 * @param {NodeJS.ReadableStream} input - Process input.
 * @param {NodeJS.WritableStream} output - Process output.
 * @param {Object} inputOptions - Configurable question options.
 * @param {number} [inputOptions.maxPerPage] - Max items per page.
 * @param {String} [inputOptions.navigationHint] - Text output of the navigation hint.
 * @returns {SelectorInterface}
 */

function createSelectorInterface(input, output, inputOptions = {}) {
    const defaultOptions = {
        maxPerPage: 10,
        maxWidth: 60,
        navigationHint: "Navigate: using arrow keys or WASD",
    };
    const options = { ...defaultOptions, ...inputOptions };

    let lastWrittenLineCount = 0;

    input.setRawMode(true);
    input.resume();
    input.setEncoding("utf8");

    const closeInterface = () => {
        input.pause();
    };
    const clearInterface = () => {
        output.moveCursor(-100, -lastWrittenLineCount);
        output.clearScreenDown();
        lastWrittenLineCount = 0;
    };

    return {
        question: askQuestion,
        close: closeInterface,
        clear: clearInterface,
    };

    /**
     * @type {AskQuestion} - Promise based question handler
     */
    function askQuestion(prompt, listEntries) {
        lastWrittenLineCount = 0;
        return new Promise(enableSelector(prompt, listEntries));
    }
    function enableSelector(prompt, listEntries) {
        return (resolve) => {
            const pointerPosition = {
                page: 0,
                index: 0,
            };
            const { pointerTo, movePointer, getCurrentIndex } =
                createReadlineSelectorMethods(
                    prompt,
                    listEntries,
                    pointerPosition
                );
            pointerTo(pointerPosition.page, pointerPosition.index);

            const exitReadline = () => {
                console.log("\nExiting readline...");
                input.pause();
                resolve({
                    index: -1,
                    value: null,
                });
            };

            const keyDirectionMap = {
                65: {
                    name: "up",
                    direction: -1,
                    isVertical: true,
                },
                66: {
                    name: "down",
                    direction: 1,
                    isVertical: true,
                },
                68: {
                    name: "left",
                    direction: -1,
                    isVertical: false,
                },
                67: {
                    name: "right",
                    direction: 1,
                    isVertical: false,
                },
            };

            input.on("data", (key) => {
                if (key === "\u0003") {
                    console.log(
                        "Termination signal received. Exiting process..."
                    );
                    process.exit();
                }

                switch (true) {
                    case /[wasd]/gu.test(key): {
                        const isVertical = /[ws]/gu.test(key);
                        const isForwards = /[sd]/gu.test(key);
                        const direction = isForwards ? 1 : -1;

                        movePointer(direction, isVertical);
                        break;
                    }
                    case key.charCodeAt(0) === 13: {
                        const elementIndex = getCurrentIndex();
                        output.cursorTo(0);
                        output.clearScreenDown();

                        resolve({
                            index: elementIndex,
                            value: listEntries[elementIndex][1],
                        });
                        break;
                    }
                    case key.charCodeAt(0) === 127: {
                        exitReadline();
                        break;
                    }
                    case key.charCodeAt(0) === 27: {
                        const arrowKey =
                            keyDirectionMap[String(key.charCodeAt(2))];
                        if (!arrowKey) {
                            exitReadline();
                            return;
                        }
                        const { direction, isVertical } = arrowKey;
                        movePointer(direction, isVertical);
                    }
                }

                output.moveCursor(-1, 0);
            });
        };
    }

    function createReadlineSelectorMethods(
        prompt,
        listEntries,
        pointerPosition
    ) {
        const formatter = initializeColorFormatter();
        const displayValues = listEntries.map(([display]) => display);

        const { maxPerPage, maxWidth, navigationHint } = options;
        const pageCount = Math.ceil(displayValues.length / maxPerPage);

        const getPage = (pageNumber) => {
            const startIndex = pageNumber * maxPerPage;
            const endIndex = startIndex + maxPerPage;
            return displayValues.slice(startIndex, endIndex);
        };

        const padPage = (pageItems, currentPage) => {
            return Array.from(Array(maxPerPage).keys(), (index) => {
                const exists = index < pageItems.length;
                return {
                    exists,
                    label: pageItems[index],
                    number: index + currentPage * maxPerPage,
                };
            });
        };

        const makeListItemDisplay = (listItem, index) => {
            const { label, number, exists } = listItem;
            if (!exists) return "";
            const isHighlighted = index === pointerPosition.index;
            const visualIndexPadded = String(number).padEnd(2, " ");
            const outputString = `${visualIndexPadded}. ${label}`;
            const truncatedOutput = truncate(outputString, maxWidth);
            if (!isHighlighted) return truncatedOutput;
            return formatter
                .format(truncatedOutput)
                .toColor("cyan", "bright")
                .decorate("bold", "italic", "underline")
                .toString();
        };

        const createBody = (pageNumber) => {
            const pageItems = getPage(pageNumber);
            const paddedItems = padPage(pageItems, pageNumber);

            return paddedItems.map(makeListItemDisplay).join("\n");
        };

        const formatNumber = (pageNumber) =>
            formatter
                .format(String(pageNumber))
                .toColor("yellow")
                .decorate("bold")
                .toString();

        const createPageContents = (pageNumber, itemIndex) => {
            const pageBody = createBody(pageNumber, itemIndex);
            const pageNumberDisplay = `Page ${formatNumber(
                pageNumber + 1
            )} of ${formatNumber(pageCount)}`;
            return `${prompt}\n${pageBody}\n${pageNumberDisplay}\n${navigationHint}\n`;
        };

        const writeToOutput = (pageContents) => {
            if (lastWrittenLineCount > 0) {
                output.moveCursor(0, -lastWrittenLineCount);
            }
            lastWrittenLineCount = (pageContents.match(/\n/gu) || []).length;
            output.clearScreenDown();
            output.clearLine();
            output.write(pageContents);
        };

        const displayPage = (pageNumber = 0, itemIndex = 0) => {
            const pageContents = createPageContents(pageNumber, itemIndex);
            writeToOutput(pageContents);
        };

        const pointerTo = (page, itemIndex) => {
            pointerPosition.page = page;
            pointerPosition.index = itemIndex;

            displayPage(page, itemIndex);
        };
        const movePointer = (direction, isVertical) => {
            const { page, index } = pointerPosition;

            const pageDirection = isVertical ? 0 : direction;
            const indexDirection = isVertical ? direction : 0;

            const targetPage = carouselValue(page, pageDirection, pageCount);
            const maxIndex = getPage(targetPage).length;

            const targetIndex = carouselValue(
                Math.min(index, maxIndex - 1),
                indexDirection,
                maxIndex
            );
            pointerTo(targetPage, targetIndex);
        };

        const getCurrentIndex = () => {
            return pointerPosition.page * maxPerPage + pointerPosition.index;
        };

        return {
            pointerTo,
            movePointer,
            getCurrentIndex,
        };
    }
}

function carouselValue(value, direction, max) {
    return (value + direction + max) % max;
}

export { createSelectorInterface };
