import readline from "node:readline";
import { initializeCFormatter } from "../string/c-format.js";
/**
 * Take an array of promises and pretty prints a console.log for each
 * iteration of the array.
 * @param promises Array of asynchronous promises.
 * @param message Message output for each iteration, utilizing the following
 * C formatted specifiers for string input:
 * - %c: current value.
 * - %i: current index.
 * - %m: max value.
 * - %p: current percentage.
 * Can be replaced with a pure callback function.
 * @param options
 * @returns
 */
async function logProgress(promises, message, options) {
    const { sync: processSynchronously, throttleRate } = {
        sync: false,
        throttleRate: 30,
        ...(options || {}),
    };
    let currentIndex = 0;
    let lastTime = 0;
    let lastLineCount = 0;
    const itemsLength = promises.length;
    const logMessage = message || `Promise: %04i / %04m\nCompletion: %3.0p%%`;
    const generate = generateMessageCurry(logMessage);
    if (!processSynchronously) {
        const resolvedPromises = promises.map((value) => {
            return trackItem(value);
        });
        return Promise.all(resolvedPromises);
    }
    const output = [];
    for (const promise of promises) {
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
        const outputMessage = `${generate(currentValue, index, max)}\n`;
        if (lastLineCount > 0) {
            readline.moveCursor(process.stdout, 0, -lastLineCount);
        }
        readline.clearScreenDown(process.stdout);
        process.stdout.write(outputMessage);
        lastLineCount = (outputMessage.match(/\n/gu) || []).length;
    }
}
function generateMessageCurry(input) {
    if (typeof input === "function") {
        return input;
    }
    return (currentValue, index, max) => {
        const formatter = initializeCFormatter({
            i: String(index),
            m: String(max),
            p: String((index / max) * 100),
            c: String(currentValue),
        });
        return formatter.apply(input);
    };
}
export { logProgress };
