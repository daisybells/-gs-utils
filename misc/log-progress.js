import readline from "node:readline";
import { createFormatSpecifiers } from "./string/c-format.js";

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
 * @returns {Promise<Array>} - Final await Promise.all() values transformed from initial array.
 */
async function logProgress(promiseArray, inputMessage) {
    const logMessage =
        inputMessage || "Promise: %04i / %04m\nCompletion: %3.0p%%";
    let currentIndex = 0;
    const generate = generateMessageCurry(logMessage);
    const numberOfPromises = promiseArray.length;

    const resolvedPromises = promiseArray.map(async (promise) => {
        const result = await promise;
        currentIndex++;
        const message = `${generate(result, currentIndex, numberOfPromises)}\n`;
        const messageRowCount = message.split("\n").length;
        const { rows } = process.stdout;

        if (currentIndex === 0) {
            process.stdout.write(message);
        }

        for (let row = 1; row <= messageRowCount; row++) {
            process.stdout.clearLine(0);
            readline.cursorTo(process.stdout, 0, rows - row);
        }

        process.stdout.clearLine(0);
        process.stdout.write(message);

        return result;
    });
    return await Promise.all(resolvedPromises);
}

function generateMessageCurry(input) {
    if (typeof input === "function") return input;

    return (currentValue, index, max) => {
        const format = createFormatSpecifiers({
            i: index,
            m: max,
            p: (index / max) * 100,
            c: currentValue,
        });
        return format(input);
    };
}

export { logProgress };
