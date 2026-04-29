/**
 * Create a function that generates a progress bar from a decimal percentage
 * @param width
 * @param options
 * @returns
 */
function createProgressBarGenerator(width = 20, options) {
    const { active, inactive } = {
        active: "\u2589",
        inactive: "_",
        ...(options || {}),
    };
    return (percentage) => {
        const numberOfProgressCharacters = Math.floor(width * percentage);
        return `[${active.repeat(numberOfProgressCharacters).padEnd(width, inactive)}]`;
    };
}
export { createProgressBarGenerator };
//# sourceMappingURL=progress-bar.js.map