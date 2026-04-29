export type Entry<EntryType> = [string, EntryType];
export type DirectionMapEntry = number | number[] | string;
export type KeyMap = Map<string, keyof DirectionMap>;
export type DirectionMap = {
    up: DirectionMapEntry[];
    down: DirectionMapEntry[];
    left: DirectionMapEntry[];
    right: DirectionMapEntry[];
};
export type MoveDirection = keyof DirectionMap;
export type ReadlineSelectorQuestionOptions = {
    max_width: number;
    entries_per_page: number;
    navigation_hint: string;
    return_index: boolean;
};
export type ReadlineSelectorQuestionConfig = {
    entries: Entry<unknown>[];
    page_count: number;
    prompt: string;
} & ReadlineSelectorQuestionOptions;
export type ReadlineSelectorState = {
    page: number;
    index: number;
};
