/**
 * Generates a progress bar from a given decimal percentage.
 */
export type ProgressBarGenerator = (percentage: number) => string;
export type CreateProgressBarGeneratorOptions = {
    /**
     * Character for active progrss bar cell.
     * @default "\u2589"
     */
    active: string;
    /**
     * Character for inactive progress bar cell.
     * @default "_"
     */
    inactive: string;
};
/**
 * Callback to manually build message without C formatter.
 */
export type GenerateMessage<T> = (currentValue: T, index: number, max: number) => string;
export type LogState = {
    last_time: number;
    last_line_count: number;
};
export type LogProgressOptions = {
    /**
     * Determine how often the progress log updates (ms)
     * @default 30
     */
    throttleRate: number;
};
