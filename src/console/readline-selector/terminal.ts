function initializeTerminalOutputMethods(output: NodeJS.WriteStream) {
    let lastWrittenLineCount: number = 0;

    function writeToOutput(text: string) {
        const paddedText: string = text.endsWith("\n") ? text : `${text}\n`;

        lastWrittenLineCount = (paddedText.match(/\n/gu) || []).length;
        output.write(paddedText);
    }

    function clearOutput() {
        if (lastWrittenLineCount > 0) {
            output.moveCursor(-1000, -lastWrittenLineCount);
        }
        lastWrittenLineCount = 0;
        output.clearScreenDown();
        output.clearLine(0);
    }
    function refreshOutput(text: string) {
        clearOutput();
        writeToOutput(text);
    }

    return { clearOutput, writeToOutput, refreshOutput };
}

function initializeTerminalInputMethods(input: NodeJS.ReadStream) {
    let isRunning: boolean = false;
    let interact: (key: string) => void = () => {};

    function createInterface(listener?: (key: string) => void): void {
        if (isRunning) {
            return;
        }
        isRunning = true;
        input.setRawMode(true);
        input.setEncoding("utf8");
        input.resume();

        interact = (key: string) => {
            if (key.toString() === "\u0003") {
                console.log("\nTermination signal received. Exiting proces...");
                process.exit();
            }
            if (listener) {
                listener(key);
            }
        };

        input.on("data", interact);
    }

    function closeInterface(): void {
        if (!isRunning) {
            return;
        }
        isRunning = false;
        input.removeListener("data", interact);
        input.pause();
    }
    return { createInterface, closeInterface };
}

export { initializeTerminalInputMethods, initializeTerminalOutputMethods };
