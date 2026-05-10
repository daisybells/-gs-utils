import { truncate } from "../../../string/wrap.js";
import { initializeColorFormatter } from "../../console-format.js";
function initializePageBuilders(config) {
    const { entries_per_page, max_width, page_count } = config;
    const formatter = initializeFormatFunctions();
    function createEntryLabels(entries) {
        return entries.map(buildEntryLabel);
    }
    function buildEntryLabel(entry, index) {
        const [label] = entry;
        const paddedIndex = String(index).padEnd(2, " ");
        return truncate(`${paddedIndex}. ${label}`, max_width);
    }
    function buildPageNumberHint(pageNumber) {
        return `Page ${formatter.colorNumber(pageNumber + 1)} of ${formatter.colorNumber(page_count)}`;
    }
    function buildPageList(entryLabels, state) {
        const paddedEntries = Array.from({ length: entries_per_page }, (value, index) => {
            const label = entryLabels[index];
            if (!label) {
                return "";
            }
            const isHighlighted = state.index === index;
            if (isHighlighted) {
                return formatter.highlightEntryLabel(label);
            }
            return label;
        });
        return paddedEntries.join("\n");
    }
    return {
        buildPageList,
        buildPageNumberHint,
        createEntryLabels,
    };
}
function initializeFormatFunctions() {
    const formatter = initializeColorFormatter();
    function highlightEntryLabel(entryLabel) {
        return formatter
            .format(entryLabel)
            .toColor("cyan", "bright")
            .decorate("bold", "italic", "underline")
            .toString();
    }
    function colorNumber(pageNumber) {
        return formatter
            .format(String(pageNumber))
            .toColor("yellow")
            .decorate("bold")
            .toString();
    }
    return {
        highlightEntryLabel,
        colorNumber,
    };
}
export { initializePageBuilders };
