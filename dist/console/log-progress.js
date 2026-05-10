import readline from "node:readline";
import { initializeCFormatter } from "../string/c-format.js";
const DEFAULT_THROTTLE_RATE_MS = 30;
const DEFAULT_MESSAGE = "Index: %04i / %04m\nCompletion: %3.0p%%";
/**
 * Creates a function that tracks an item in terminal.
 * @param count Number of items to log.
 * @param message Message output for each iteration, utilizing the following
 * C formatted specifiers for string input:
 * - %c: current value.
 * - %i: current index.
 * - %m: max value.
 * - %p: current percentage.
 * Can be replaced with a pure callback function.
 * @param options
 */
function createProgressLogger(message, options) {
    const { throttleRate } = {
        throttleRate: DEFAULT_THROTTLE_RATE_MS,
        ...(options || {}),
    };
    const state = {
        last_time: 0,
        last_line_count: 0,
    };
    const generate = generateMessageCurry(message || DEFAULT_MESSAGE);
    const updateTerminal = updateTerminalCurry(state);
    return {
        log: (value, index, max) => {
            const now = Date.now();
            const isFinal = index === max;
            if (isFinal || now - state.last_time > throttleRate) {
                updateTerminal(generate(value, index, max));
                state.last_time = now;
            }
        },
    };
}
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
async function logPromiseArray(promises, message, options) {
    const itemsLength = promises.length;
    const logger = createProgressLogger(message, options);
    const resolvedPromises = promises.map(async (value, index) => {
        logger.log(await value, index, itemsLength - 1);
        return value;
    });
    return Promise.all(resolvedPromises);
}
function updateTerminalCurry(state) {
    return (message) => {
        if (state.last_line_count > 0) {
            readline.moveCursor(process.stdout, -1000, -state.last_line_count);
        }
        state.last_line_count = (message.match(/\n/gu) || []).length + 1;
        readline.clearScreenDown(process.stdout);
        readline.clearLine(process.stdout, 0);
        process.stdout.write(message + "\n");
    };
}
function generateMessageCurry(message) {
    if (typeof message === "function") {
        return message;
    }
    const stringMessage = message;
    return (currentValue, index, max) => {
        const formatter = initializeCFormatter({
            i: String(index),
            m: String(max),
            p: String((index / max) * 100),
            c: String(currentValue),
        });
        return formatter.apply(stringMessage);
    };
}
export { logPromiseArray, createProgressLogger };
