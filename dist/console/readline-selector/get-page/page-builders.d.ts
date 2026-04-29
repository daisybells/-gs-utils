import type { Entry, ReadlineSelectorQuestionConfig, ReadlineSelectorState } from "../../../types/console/readline-selector.js";
declare function initializePageBuilders(config: ReadlineSelectorQuestionConfig): {
    buildPageList: (entryLabels: string[], state: ReadlineSelectorState) => string;
    buildPageNumberHint: (pageNumber: number) => string;
    createEntryLabels: <EntryType>(entries: Entry<EntryType>[]) => string[];
};
export { initializePageBuilders };
