import { initializeColorFormat } from "./console-format.js";

function createSelectorInterface(processIO = {}, listItems) {
    const { input, output } = processIO;

    input.setRawMode(true);
    input.resume();
    input.setEncoding("utf8");
    return {
        question: askQuestion(processIO, listItems),
        close: () => {
            input.pause();
        },
        clear: () => {
            output.cursorTo(0, 0);
            output.clearScreenDown();
        },
    };
}

function askQuestion(processIO, listItems) {
    return (prompt, inputOptions = {}) => {
        const defaultOptions = {
            maxPerPage: 10,
            navigationHint:
                "Navigate:\n      | w \u2191 |\n| a \u2190 | s \u2193 | d \u2192 |",
        };
        const options = { ...defaultOptions, ...inputOptions };
        return new Promise(
            enableSelector(processIO, prompt, listItems, options)
        );
    };
}
function enableSelector(processIO, prompt, listItems, options) {
    const { input, output } = processIO;
    const { maxPerPage } = options;

    return (resolve) => {
        const pointerPosition = {
            page: 0,
            index: 0,
        };
        const { pointerTo, movePointer } = createReadlineSelectorMethods(
            processIO,
            prompt,
            listItems,
            options,
            pointerPosition
        );
        pointerTo(pointerPosition.page, pointerPosition.index);

        input.on("data", (key) => {
            if (key === "\u0003") {
                console.log("Termination signal received. Exiting process...");
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
                    showPage(pointerPosition.page, pointerPosition.highlight);
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
                case key.charCodeAt(0) === 127 || key.charCodeAt(0) === 27: {
                    console.log("\nCancelling readline...");
                    input.pause();
                    resolve(null);
                    break;
                }
            }
            output.moveCursor(-1, 0);
        });
    };
}

function createReadlineSelectorMethods(
    processIO,
    prompt,
    listItems,
    inputOptions,
    pointerPosition
) {
    const formatter = initializeColorFormat();
    const { output } = processIO;

    const { maxPerPage, navigationHint } = inputOptions;
    const pageCount = Math.ceil(listItems.length / maxPerPage);

    const getPage = (pageNumber) => {
        const startIndex = pageNumber * maxPerPage;
        const endIndex = startIndex + maxPerPage;
        return listItems.slice(startIndex, endIndex);
    };

    const padPage = (pageItems, currentPage) => {
        return Array.from(Array(maxPerPage).keys(), (index) => ({
            label: pageItems[index],
            number: index + currentPage * maxPerPage,
        }));
    };

    const makeListItemDisplay = (listItem, index) => {
        const { label, number } = listItem;
        if (!label) return "";
        const isHighlighted = index === pointerPosition.index;
        const visualIndexPadded = String(number).padEnd(2, " ");
        const outputString = `${visualIndexPadded}. ${label}`;
        if (!isHighlighted) return outputString;
        const clearedOutput = formatter.clear(outputString);
        const highlightIndicator = "%(cyan,bright)f%(bold,italic)d";
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
        output.cursorTo(0, 0);
        output.clearScreenDown();
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
        getPage,
        padPage,
        makeListItemDisplay,
        createBody,
        createPageContents,
        writeToOutput,
        displayPage,
        pointerTo,
        movePointer,
    };
}

function carouselValue(value, direction, max) {
    return (value + direction + max) % max;
}

function createPageContents(question, body, pageNumberDisplay, hint) {
    return `${question}\n${body}\n${pageNumberDisplay}\n${hint}\n`;
}

export { createSelectorInterface };
