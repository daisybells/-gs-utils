import readline from "node:readline";
import { initializeCFormatter } from "../string/c-format.js";

/**
 *
 * @callback format
 * @param {any} currentValue - The returned value from a given promise.
 * @param {number} index - Current promise index that is being processed.
 * @param {number} max - Max value of the input Promise array.
 *
 * @returns {string} - Formatted string to be printed to console.
 */

/**
 * Takes an array of promises and pretty prints a console.log for each
 * iteration of the array.
 * @param {Promise[]} promiseArray - Array of asynchronous promises
 * @param {format|string} [inputMessage] - Message to output for each iteration. Utilizes
 * C code format specifiers for string input. String values are mapped as follows:
 * %c: current value
 * %i: current index,
 * %m: max value,
 * %p: current percentage,
 * @param {object} [inputOptions] - Configurable function options.
 * @param {Boolean} [inputOptions.sync = false] - Process synchronously (true) or asynchronously (false).
 * @param {number} [inputOptions.throttleRate = 30] - Time between each terminal update in ms.
 * @returns {Promise<Array>} - Final await Promise.all() values transformed from initial array.
 */
async function logProgress(promiseArray, inputMessage, inputOptions) {
    const defaultOptions = { sync: false, throttleRate: 30 };
    const { sync: processSynchronously, throttleRate } = {
        ...defaultOptions,
        inputOptions,
    };
    let currentIndex = 0;
    let lastTime = 0;
    let lastLineCount = 0;

    const logMessage =
        inputMessage || "Promise: %04i / %04m\nCompletion: %3.0p%%";

    const generate = generateMessageCurry(logMessage);
    const itemsLength = promiseArray.length;

    if (!processSynchronously) {
        const resolvedPromises = promiseArray.map(trackItem);
        return await Promise.all(resolvedPromises);
    }

    const output = [];

    for (const promise of promiseArray) {
        output.push(await trackItem(promise));
    }
    return output;

    async function trackItem(promise) {
        const result = await promise;
        currentIndex++;
        const now = Date.now();
        const isFinal = currentIndex === itemsLength;

        if (isFinal || now - lastTime > throttleRate) {
            updateTerminal(result, currentIndex, itemsLength);
            lastTime = now;
        }

        return result;
    }
    function updateTerminal(currentValue, index, max) {
        const message = `${generate(currentValue, index, max)}\n`;

        if (lastLineCount > 0) {
            readline.moveCursor(process.stdout, 0, -lastLineCount);
        }

        readline.clearScreenDown(process.stdout);
        process.stdout.write(message);
        lastLineCount = (message.match(/\n/gu) || []).length;
    }
}

function generateMessageCurry(input) {
    if (typeof input === "function") return input;

    return (currentValue, index, max) => {
        const formatter = initializeCFormatter({
            i: index,
            m: max,
            p: (index / max) * 100,
            c: currentValue,
        });
        return formatter.apply(input);
    };
}

export { logProgress };
