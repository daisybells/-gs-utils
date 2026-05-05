function initializeTerminalOutputMethods(output) {
    let lastWrittenLineCount = 0;
    function writeToOutput(text) {
        const paddedText = text.endsWith("\n") ? text : `${text}\n`;
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
    function refreshOutput(text) {
        clearOutput();
        writeToOutput(text);
    }
    return { clearOutput, writeToOutput, refreshOutput };
}
function initializeTerminalInputMethods(input) {
    let isRunning = false;
    let interact;
    function createInterface(listener) {
        if (isRunning) {
            return;
        }
        isRunning = true;
        input.setRawMode(true);
        input.setEncoding("utf8");
        input.resume();
        interact = (key) => {
            if (String(key) === "\u0003") {
                console.log("\nTermination signal received. Exiting proces...");
                process.exit();
            }
            if (listener) {
                listener(String(key));
            }
        };
        input.on("data", interact);
    }
    function closeInterface() {
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
