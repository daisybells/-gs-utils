import { initializeColorFormatter } from "./console-format.js";
import { truncate } from "../string/basic.js";

/**
 * @typedef Answer
 * @property {Number} index - Index of chosen answer. Returns -1 if cancelled.
 * @property {never} value - Value from chosen answer.
 *
 * @typedef {[string, any]} SelectorEntry - Display string and output value.
 *
 * @typedef {-1|0|1} MoveDirection - -1: Backwards, 0: No turn, 1: Forwards
 *
 * @typedef {{
 * page: Number
 * index: Number}} PointerPosition
 *
 * @typedef {Object} SelectorInterface
 * @property {AskQuestion} question
 * @property {function(): void} close - Exit selector interface.
 * @property {function(): void} clear - Clear terminal input of last written question.
 */

/**
 * @callback PointerTo
 * @param {Number} page
 * @param {Number} itemIndex
 * @returns {void}
 *
 * @callback MovePointer
 * @param {MoveDirection} direction
 * @param {Boolean} isVertical
 * @returns {void}
 *
 * @callback GetCurrentItemIndex
 * @returns {Number}
 *
 * @typedef {{
 * pointerTo: PointerTo
 * movePointer: MovePointer
 * getCurrentIndex: GetCurrentItemIndex}} SelectorMethods
 *
 * @callback AskQuestion
 * @param {String} prompt - Question to prompt the user with.
 * @param {SelectorEntry[]} listEntries - Entries to use for question.
 * @returns {Promise<Answer>}
 */

/**
 * Initialize a CLI selector interface.
 * @param {NodeJS.ReadStream} input - Process input.
 * @param {NodeJS.WriteStream} output - Process output.
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

            input.on("data", (keyData) => {
                const key = keyData.toString("utf8");
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
    /**
     *
     * @param {String} prompt
     * @param {[String, any]} listEntries
     * @param {PointerPosition} pointerPosition
     * @returns {SelectorMethods}
     */
    function createReadlineSelectorMethods(
        prompt,
        listEntries,
        pointerPosition
    ) {
        const formatter = initializeColorFormatter();
        const displayValues = listEntries.map(([display]) => display);

        const { maxPerPage, maxWidth, navigationHint } = options;
        const pageCount = Math.ceil(displayValues.length / maxPerPage);

        /**
         *
         * @param {Number} pageNumber
         * @returns {any[]}
         */
        const getPage = (pageNumber) => {
            const startIndex = pageNumber * maxPerPage;
            const endIndex = startIndex + maxPerPage;
            return displayValues.slice(startIndex, endIndex);
        };

        /**
         * @typedef {{
         * exists: Boolean
         * label: String
         * number: Number}} PageItem
         */

        /**
         *
         * @param {String[]} pageItems
         * @param {Number} currentPage
         * @returns {PageItem[]}
         */
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

        /**
         *
         * @param {PageItem} listItem
         * @param {Number} index
         * @returns {String}
         */
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

        /**
         *
         * @param {Number} pageNumber
         * @returns {String}
         */
        const createBody = (pageNumber) => {
            const pageItems = getPage(pageNumber);
            const paddedItems = padPage(pageItems, pageNumber);

            return paddedItems.map(makeListItemDisplay).join("\n");
        };

        /**
         *
         * @param {Number} pageNumber
         * @returns {String}
         */
        const formatNumber = (pageNumber) =>
            formatter
                .format(String(pageNumber))
                .toColor("yellow")
                .decorate("bold")
                .toString();
        /**
         *
         * @param {Number} pageNumber
         * @returns {String}
         */
        const createPageContents = (pageNumber) => {
            const pageBody = createBody(pageNumber);
            const pageNumberDisplay = `Page ${formatNumber(
                pageNumber + 1
            )} of ${formatNumber(pageCount)}`;
            return `${prompt}\n${pageBody}\n${pageNumberDisplay}\n${navigationHint}\n`;
        };

        /**
         *
         * @param {String} pageContents
         * @returns {void}
         */
        const writeToOutput = (pageContents) => {
            if (lastWrittenLineCount > 0) {
                output.moveCursor(0, -lastWrittenLineCount);
            }
            lastWrittenLineCount = (pageContents.match(/\n/gu) || []).length;
            output.clearScreenDown();
            output.clearLine(0);
            output.write(pageContents);
        };

        /**
         *
         * @param {Number} pageNumber
         * @returns {void}
         */
        const displayPage = (pageNumber = 0) => {
            const pageContents = createPageContents(pageNumber);
            writeToOutput(pageContents);
        };

        /** @type {PointerTo} */
        const pointerTo = (page, itemIndex) => {
            pointerPosition.page = page;
            pointerPosition.index = itemIndex;

            displayPage(page);
        };

        /** @type {MovePointer} */
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

        /** @type {GetCurrentItemIndex} */
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
