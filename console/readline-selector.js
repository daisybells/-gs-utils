import { initializeColorFormatter } from "./console-format.js";

function createSelectorInterface(processIO = {}, listItems) {
    let lastWrittenLineCount = 0;
    const { input, output } = processIO;
    input.setRawMode(true);
    input.resume();
    input.setEncoding("utf8");

    return {
        question: askQuestion,
        close: () => {
            input.pause();
        },
        clear: () => {
            output.moveCursor(-100, -lastWrittenLineCount);
            output.clearScreenDown();
        },
    };

    function askQuestion(prompt, inputOptions) {
        const defaultOptions = {
            maxPerPage: 10,
            navigationHint: "Navigate: using arrow keys or WASD",
        };
        const options = { ...defaultOptions, ...inputOptions };

        return new Promise(enableSelector(prompt, options));
    }
    function enableSelector(prompt, options) {
        const { maxPerPage } = options;

        return (resolve) => {
            const pointerPosition = {
                page: 0,
                index: 0,
            };
            const { pointerTo, movePointer } = createReadlineSelectorMethods(
                prompt,
                options,
                pointerPosition
            );
            pointerTo(pointerPosition.page, pointerPosition.index);

            const closeReadline = () => {
                console.log("\nCancelling readline...");
                input.pause();
                resolve(null);
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
                    case /\d/gu.test(key): {
                        const numberIndex = Number.parseInt(key);
                        pointerPosition.highlight = numberIndex;
                        showPage(
                            pointerPosition.page,
                            pointerPosition.highlight
                        );
                        break;
                    }
                    case key.charCodeAt(0) === 13: {
                        const elementIndex =
                            pointerPosition.page * maxPerPage +
                            pointerPosition.index;
                        output.cursorTo(0);
                        output.clearScreenDown();
                        resolve({
                            index: elementIndex,
                            value: listItems[elementIndex],
                        });
                        break;
                    }
                    case key.charCodeAt(0) === 127: {
                        closeReadline();
                        break;
                    }
                    case key.charCodeAt(0) === 27: {
                        const arrowKey =
                            keyDirectionMap[String(key.charCodeAt(2))];
                        if (!arrowKey) {
                            closeReadline();
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
        inputOptions,
        pointerPosition
    ) {
        const formatter = initializeColorFormatter();
        const { output } = processIO;

        const { maxPerPage, navigationHint } = inputOptions;
        const pageCount = Math.ceil(listItems.length / maxPerPage);

        const getPage = (pageNumber) => {
            const startIndex = pageNumber * maxPerPage;
            const endIndex = startIndex + maxPerPage;
            return listItems.slice(startIndex, endIndex);
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
            if (!isHighlighted) return outputString;
            const clearedOutput = formatter.clear(outputString);
            const highlightIndicator =
                "%(cyan,bright)f%(bold,italic,underline)d";
            return formatter.apply(`${highlightIndicator}${clearedOutput}`);
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
            const targetIndex = carouselValue(
                index,
                indexDirection,
                getPage(targetPage).length
            );
            pointerTo(targetPage, targetIndex);
        };

        return {
            pointerTo,
            movePointer,
        };
    }
}

function carouselValue(value, direction, max) {
    return (value + direction + max) % max;
}

export { createSelectorInterface };
