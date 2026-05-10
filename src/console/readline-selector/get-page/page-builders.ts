import { truncate } from "@/string/wrap.js";
import { initializeColorFormatter } from "../../console-format.js";

import type {
	Entry,
	ReadlineSelectorQuestionConfig,
	ReadlineSelectorState,
} from "@/types/console/readline-selector.js";

function initializePageBuilders(config: ReadlineSelectorQuestionConfig) {
	const { entries_per_page, max_width, page_count } = config;
	const formatter = initializeFormatFunctions();

	function createEntryLabels<EntryType>(entries: Entry<EntryType>[]): string[] {
		return entries.map(buildEntryLabel);
	}

	function buildEntryLabel<EntryType>(
		entry: Entry<EntryType>,
		index: number,
	): string {
		const [label] = entry;
		const paddedIndex: string = String(index).padEnd(2, " ");
		return truncate(`${paddedIndex}. ${label}`, max_width);
	}
	function buildPageNumberHint(pageNumber: number): string {
		return `Page ${formatter.colorNumber(pageNumber + 1)} of ${formatter.colorNumber(page_count)}`;
	}

	function buildPageList(
		entryLabels: string[],
		state: ReadlineSelectorState,
	): string {
		const paddedEntries: string[] = Array.from(
			{ length: entries_per_page },
			(value, index) => {
				const label = entryLabels[index];
				if (!label) {
					return "";
				}
				const isHighlighted = state.index === index;
				if (isHighlighted) {
					return formatter.highlightEntryLabel(label);
				}

				return label;
			},
		);
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

	function highlightEntryLabel(entryLabel: string): string {
		return formatter
			.format(entryLabel)
			.toColor("cyan", "bright")
			.decorate("bold", "italic", "underline")
			.toString();
	}
	function colorNumber(pageNumber: number): string {
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
