// BASIC
export interface TruncateOptions {
    /**
     * Indicator that the input string has been truncated.
     * @default "..."
     */
    indicator: string;
}

// NORMALIZE
export interface NormalizeStringOptions {
    /**
     * When false, removes all space characters from the string.
     * @default false
     */
    preserveSpaces: boolean;
    /**
     * When true, reduces all space characters to a singular space.
     * @default true
     */
    collapseWhiteSpace: boolean;
    /**
     * Character that spaces will be replaced with, if preserveSpaces = true.
     * @default "-"
     */
    spaceCharacter: string;
}

// CFormatter

/**
 * Special string with '%' identifiers and C-like formatting.
 */
export type CFormatString = string;

export type ClearFormattingFunction = (input: CFormatString) => string;
export type ApplyFormattingFunction = (input: CFormatString) => string;

export type CFormatter = {
    /**
     * Replace all C-Format specifiers in input string to be ignored.
     */
    clear: ClearFormattingFunction;
    /**
     * Apply C-Formatting to string.
     */
    apply: ApplyFormattingFunction;
};

export type DataMap = {
    [key: string]: string;
};
