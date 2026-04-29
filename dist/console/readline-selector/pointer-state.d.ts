import type { ReadlineSelectorQuestionConfig, ReadlineSelectorState, MoveDirection } from "../../types/console/readline-selector.js";
declare function initializeStateMethods(config: ReadlineSelectorQuestionConfig): {
    movePointer: (direction: MoveDirection) => void;
    pointerTo: (page: number, index: number) => void;
    getCurrentState: () => ReadlineSelectorState;
    returnPointerIndex: () => number;
};
export { initializeStateMethods };
