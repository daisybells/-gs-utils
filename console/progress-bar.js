/**
 * Returns a function that generates a progress bar based on an input percentage.
 * @param {number} [width = 20] - Number of cells progress bar consists of. Defaults to 20.
 * @param {object} [inputOptions] - Configurable progress bar options.
 * @param {string} [inputOptions.active = "\u2589"] - Character to use for an active progress
 * bar cell.
 * @param {string} [inputOptions.inactive = "_"] - Character to use for inactive progress bar cell.
 * @returns {function(number): string} - Function that takes an input decimal percentage and returns
 * a progress bar that matches the given percentage.
 */

function createProgressBarGenerator(width = 20, inputOptions = {}) {
    const defaultOptions = {
        active: "\u2589",
        inactive: "_",
    };
    const { active, inactive } = { ...inputOptions, ...defaultOptions };
    return (percentage) => {
        const numberOfProgressCharacters = Math.floor(width * percentage);
        const activeProgress = active.repeat(numberOfProgressCharacters);
        return `[${activeProgress.padEnd(width, inactive)}]`;
    };
}

export { createProgressBarGenerator };
