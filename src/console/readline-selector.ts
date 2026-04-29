import { defineConfig } from "./readline-selector/config.js";
import { initializeIndexPage } from "./readline-selector/get-page/index-page.js";
import { initializeStateMethods } from "./readline-selector/pointer-state.js";
import {
    initializeTerminalInputMethods,
    initializeTerminalOutputMethods,
} from "./readline-selector/terminal.js";
import { createKeyMap, normalizeKey } from "./readline-selector/key-reader.js";

import type {
    ReadlineSelectorQuestionOptions,
    Entry,
    ReadlineSelectorState,
    ReadlineSelectorQuestionConfig,
    DirectionMap,
    MoveDirection,
    KeyMap,
} from "@/types/console/readline-selector.js";

type Pointer = ReturnType<typeof initializeStateMethods>;
type Indexer = ReturnType<typeof initializeIndexPage>;
type TerminalReader = ReturnType<typeof initializeTerminalInputMethods>;
type TerminalWriter = ReturnType<typeof initializeTerminalOutputMethods>;

function createSelectorInterface(
    input: NodeJS.ReadStream,
    output: NodeJS.WriteStream,
    options?: Partial<ReadlineSelectorQuestionOptions>,
) {
    const questionOptions: ReadlineSelectorQuestionOptions = {
        entries_per_page: 5,
        max_width: 60,
        navigation_hint: "Navigate using WASD or the arrow keys.",
        return_index: false,
        ...(options || {}),
    };

    const DIRECTION_MAP: DirectionMap = {
        up: ["w", [27, 91, 65]],
        down: ["s", [27, 91, 66]],
        left: ["a", [27, 91, 68]],
        right: ["d", [27, 91, 67]],
    } as const;

    const keyMap: KeyMap = createKeyMap(DIRECTION_MAP);

    const reader: TerminalReader = initializeTerminalInputMethods(input);
    const writer: TerminalWriter = initializeTerminalOutputMethods(output);

    return {
        question: askQuestion,
        close: reader.closeInterface,
        clear: writer.clearOutput,
    };

    async function askQuestion<ValueType>(
        prompt: string,
        entries: Entry<ValueType>[],
    ): Promise<null | ValueType> {
        const config: ReadlineSelectorQuestionConfig = defineConfig(
            entries,
            prompt,
            questionOptions,
        );

        const pointer: Pointer = initializeStateMethods(config);
        const indexPage: Indexer = initializeIndexPage(config);

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

        function displayPage(state: ReadlineSelectorState): void {
            const pageContents = indexPage(state);
            writer.refreshOutput(pageContents);
        }

        function resolveAnswer(resolve: (value: number | null) => void): void {
            reader.createInterface((key: string): void => {
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
                const direction: MoveDirection | undefined = keyMap.get(
                    normalizeKey(key),
                );
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
