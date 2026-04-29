import { initializePageBuilders } from "./page-builders.js";
function initializeIndexPage(config) {
    const { page_count, entries_per_page, entries, prompt, navigation_hint } = config;
    const builders = initializePageBuilders(config);
    const entryLabels = builders.createEntryLabels(entries);
    function getPageLabels(pageNumber) {
        if (pageNumber > page_count) {
            throw new Error("Page number does not exist.");
        }
        const startIndex = pageNumber * entries_per_page;
        const endIndex = startIndex + entries_per_page;
        return entryLabels.slice(startIndex, endIndex);
    }
    function indexPage(state) {
        const labels = getPageLabels(state.page);
        const list = builders.buildPageList(labels, state);
        const pageNumberHint = builders.buildPageNumberHint(state.page);
        return `${prompt}\n${list}\n${pageNumberHint}\n${navigation_hint}\n`;
    }
    return indexPage;
}
export { initializeIndexPage };
//# sourceMappingURL=index-page.js.map