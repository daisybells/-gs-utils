import type {
    CreateProgressBarGeneratorOptions,
    ProgressBarGenerator,
} from "@/types/console.js";
/**
 * Create a function that generates a progress bar from a decimal percentage
 * @param width
 * @param options
 * @returns
 */
function createProgressBarGenerator(
    width: number = 20,
    options?: Partial<CreateProgressBarGeneratorOptions>,
): ProgressBarGenerator {
    const { active, inactive }: CreateProgressBarGeneratorOptions = {
        active: "\u2589",
        inactive: "_",
        ...(options || {}),
    };
    return (percentage: number): string => {
        const numberOfProgressCharacters: number = Math.floor(
            width * percentage,
        );
        return `[${active.repeat(numberOfProgressCharacters).padEnd(width, inactive)}]`;
    };
}

export { createProgressBarGenerator };
