import type { ReadlineSelectorQuestionOptions, ReadlineSelectorQuestionConfig, Entry } from "../../types/console/readline-selector.js";
declare function defineConfig<ValueType>(entries: Entry<ValueType>[], prompt: string, options: ReadlineSelectorQuestionOptions): ReadlineSelectorQuestionConfig;
export { defineConfig };
