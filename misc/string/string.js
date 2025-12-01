function capitalizeWords(string) {
    return string.replaceAll(/\b\w(?!\s)/giu, (letter) => letter.toUpperCase());
}

export { capitalizeWords };
