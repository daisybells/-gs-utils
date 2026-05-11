import path from "node:path";
/**
 * Capitalize the first letter of every word.
 * @param string
 * @returns
 */
function capitalize(string: string): string {
	return string.replaceAll(/\b\w(?!\s)/giu, (letter: string) =>
		letter.toUpperCase(),
	);
}
function removeExtension(filepath: string): string {
	const lastSeparatorIndex = filepath.lastIndexOf(path.sep);
	const lastDotIndex = filepath.lastIndexOf(".");
	if (lastSeparatorIndex > lastDotIndex) {
		return filepath;
	}
	return filepath.slice(0, filepath.lastIndexOf("."));
}

function getCodePoints(string: string): number[] {
	if (string.length === 1) {
		const codePoint = string.codePointAt(0);
		if (codePoint === undefined) {
			return [];
		}

		return [codePoint];
	}

	return string.split("").map((character: string): number => {
		const code: number | undefined = character.codePointAt(0);
		if (code === undefined) {
			throw new Error("Undefined character code found.");
		}
		return code;
	});
}

function randomString(length: number) {
	return Array.from(new Array(length), (v, i) => {
		const value = Math.floor(Math.random() * 52);
		return String.fromCodePoint(value <= 25 ? value + 65 : value + 71);
	}).join("");
}

export { capitalize, getCodePoints, removeExtension, randomString };
