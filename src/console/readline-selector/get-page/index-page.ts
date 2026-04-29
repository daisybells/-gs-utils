import { initializePageBuilders } from "./page-builders.js";

import type {
    ReadlineSelectorQuestionConfig,
    ReadlineSelectorState,
} from "@/types/console/readline-selector.js";

function initializeIndexPage(config: ReadlineSelectorQuestionConfig) {
    const { page_count, entries_per_page, entries, prompt, navigation_hint } =
        config;

    const builders = initializePageBuilders(config);

    const entryLabels: string[] = builders.createEntryLabels(entries);

    function getPageLabels(pageNumber: number): string[] {
        if (pageNumber > page_count) {
            throw new Error("Page number does not exist.");
        }

        const startIndex: number = pageNumber * entries_per_page;
        const endIndex: number = startIndex + entries_per_page;
        return entryLabels.slice(startIndex, endIndex);
    }

    function indexPage(state: ReadlineSelectorState): string {
        const labels: string[] = getPageLabels(state.page);
        const list: string = builders.buildPageList(labels, state);

        const pageNumberHint: string = builders.buildPageNumberHint(state.page);

        return `${prompt}\n${list}\n${pageNumberHint}\n${navigation_hint}\n`;
    }

    return indexPage;
}

export { initializeIndexPage };
