function defineConfig(entries, prompt, options) {
    return {
        ...options,
        entries,
        prompt,
        page_count: Math.ceil(entries.length / options.entries_per_page),
    };
}
export { defineConfig };
