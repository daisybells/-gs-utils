import type { CreateProgressBarGeneratorOptions, ProgressBarGenerator } from "../types/console.js";
/**
 * Create a function that generates a progress bar from a decimal percentage
 * @param width
 * @param options
 * @returns
 */
declare function createProgressBarGenerator(width?: number, options?: Partial<CreateProgressBarGeneratorOptions>): ProgressBarGenerator;
export { createProgressBarGenerator };
