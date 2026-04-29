import type {
    ReadlineSelectorQuestionOptions,
    ReadlineSelectorQuestionConfig,
    Entry,
} from "@/types/console/readline-selector.js";

function defineConfig<ValueType>(
    entries: Entry<ValueType>[],
    prompt: string,
    options: ReadlineSelectorQuestionOptions,
): ReadlineSelectorQuestionConfig {
    return {
        ...options,
        entries,
        prompt,
        page_count: Math.ceil(entries.length / options.entries_per_page),
    };
}

export { defineConfig };
