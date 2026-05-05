// PROGRESS BAR GENERATOR
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

// LOG PROGRESS
/**
 * Callback to manually build message without C formatter.
 */
export type GenerateMessage<T> = (
    currentValue: T,
    index: number,
    max: number,
) => string;

export type LogProgressOptions = {
    /**
     * Process promises synchronously (true) or asynchronously (false).
     * @default false
     */
    sync: boolean;
    /**
     * Determine how often the progress log updates (ms)
     * @default 30
     */
    throttleRate: number;
};
