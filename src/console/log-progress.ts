import readline from "node:readline";
import { initializeCFormatter } from "../string/c-format.js";

import type { CFormatString } from "@/types/string.js";
import type {
	LogProgressOptions,
	GenerateMessage,
	LogState,
} from "@/types/console.js";

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
function createProgressLogger<T>(
	message?: CFormatString | GenerateMessage<T>,
	options?: Partial<LogProgressOptions>,
) {
	const { throttleRate }: LogProgressOptions = {
		throttleRate: DEFAULT_THROTTLE_RATE_MS,
		...(options || {}),
	};

	const state: LogState = {
		last_time: 0,
		last_line_count: 0,
	};
	const generate = generateMessageCurry<T>(message || DEFAULT_MESSAGE);

	const updateTerminal = updateTerminalCurry(state);

	return {
		log: (value: T, index: number, max: number) => {
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
async function logPromiseArray<T>(
	promises: Promise<T>[],
	message?: CFormatString | GenerateMessage<T>,
	options?: Partial<LogProgressOptions>,
) {
	const itemsLength: number = promises.length;

	const logger = createProgressLogger<T>(message, options);

	const resolvedPromises = promises.map(async (value: Promise<T>, index) => {
		logger.log(await value, index, itemsLength - 1);
		return value;
	});

	return Promise.all(resolvedPromises);
}

function updateTerminalCurry(state: LogState) {
	return (message: string) => {
		const escapedMessage = `${message}\n`;
		if (state.last_line_count > 0) {
			readline.moveCursor(process.stdout, -1000, -state.last_line_count);
		}
		state.last_line_count = (escapedMessage.match(/\n/gu) || []).length;

		readline.clearScreenDown(process.stdout);
		readline.clearLine(process.stdout, 0);
		process.stdout.write(escapedMessage);
	};
}

function generateMessageCurry<T>(
	message: GenerateMessage<T> | CFormatString,
): GenerateMessage<T> {
	if (typeof message === "function") {
		return message;
	}
	const stringMessage = message;

	return (currentValue: T, index: number, max: number) => {
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
