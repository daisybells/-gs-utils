function normalizeString(string, inputOptions) {
    const defaultOptions = { preserveSpaces: true };
    const { preserveSpaces } = { ...defaultOptions, ...inputOptions };
    const spaceReplacement = preserveSpaces ? "-" : "";
    return string
        .trim()
        .toLowerCase()
        .replaceAll(/[^\w\d ]/gu, "")
        .replaceAll(/ /gu, spaceReplacement);
}

function capitalizeWords(string) {
    return string.replaceAll(/\b\w(?!\s)/giu, (letter) => letter.toUpperCase());
}

export { normalizeString, capitalizeWords };
