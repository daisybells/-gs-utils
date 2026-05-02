export type EqeqeqOptions = {
    /**
     * Max depth of search before throwing an error. '0' means no limit.
     * @default 0
     */
    max_depth: number;
    /**
     * Determines whether order matters or not in arrays.
     * @default false
     */
    sort_arrays: false;
};
export type SortArrayByFrequencyOptions = {
    /**
     * Determines whether to sort entries of the same frequencies alphabetically.
     */
    alphabetize: boolean;
};
