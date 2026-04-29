import type { ReadlineSelectorQuestionOptions, Entry } from "../types/console/readline-selector.js";
declare function createSelectorInterface(input: NodeJS.ReadStream, output: NodeJS.WriteStream, options?: Partial<ReadlineSelectorQuestionOptions>): {
    question: <ValueType>(prompt: string, entries: Entry<ValueType>[]) => Promise<null | ValueType>;
    close: () => void;
    clear: () => void;
};
export { createSelectorInterface };
