import { defineConfig } from "./readline-selector/config.js";
import { initializeIndexPage } from "./readline-selector/get-page/index-page.js";
import { initializeStateMethods } from "./readline-selector/pointer-state.js";
import { initializeTerminalInputMethods, initializeTerminalOutputMethods, } from "./readline-selector/terminal.js";
import { createKeyMap, normalizeKey } from "./readline-selector/key-reader.js";
function createSelectorInterface(input, output, options) {
    const questionOptions = {
        entries_per_page: 5,
        max_width: 60,
        navigation_hint: "Navigate using WASD or the arrow keys.",
        return_index: false,
        ...(options || {}),
    };
    const DIRECTION_MAP = {
        up: ["w", [27, 91, 65]],
        down: ["s", [27, 91, 66]],
        left: ["a", [27, 91, 68]],
        right: ["d", [27, 91, 67]],
    };
    const keyMap = createKeyMap(DIRECTION_MAP);
    const reader = initializeTerminalInputMethods(input);
    const writer = initializeTerminalOutputMethods(output);
    return {
        question: askQuestion,
        close: reader.closeInterface,
        clear: writer.clearOutput,
    };
    async function askQuestion(prompt, entries) {
        const config = defineConfig(entries, prompt, questionOptions);
        const pointer = initializeStateMethods(config);
        const indexPage = initializeIndexPage(config);
        displayPage(pointer.getCurrentState());
        const answerIndex = await new Promise(resolveAnswer);
        if (answerIndex === null) {
            return null;
        }
        const entry = entries[answerIndex];
        if (!entry) {
            throw new Error("Out of bounds index");
        }
        return entry[1];
        function displayPage(state) {
            const pageContents = indexPage(state);
            writer.refreshOutput(pageContents);
        }
        function resolveAnswer(resolve) {
            reader.createInterface((key) => {
                if (key === "\u001b") {
                    writer.clearOutput();
                    console.log("Exiting selector interface...");
                    reader.closeInterface();
                    resolve(null);
                    return;
                }
                if (key.codePointAt(0) === 13) {
                    reader.closeInterface();
                    resolve(pointer.returnPointerIndex());
                    return;
                }
                const direction = keyMap.get(normalizeKey(key));
                if (!direction) {
                    return;
                }
                pointer.movePointer(direction);
                displayPage(pointer.getCurrentState());
            });
        }
    }
}
export { createSelectorInterface };
//# sourceMappingURL=readline-selector.js.map