declare function initializeTerminalOutputMethods(output: NodeJS.WriteStream): {
    clearOutput: () => void;
    writeToOutput: (text: string) => void;
    refreshOutput: (text: string) => void;
};
declare function initializeTerminalInputMethods(input: NodeJS.ReadStream): {
    createInterface: (listener?: (key: string) => void) => void;
    closeInterface: () => void;
};
export { initializeTerminalInputMethods, initializeTerminalOutputMethods };
