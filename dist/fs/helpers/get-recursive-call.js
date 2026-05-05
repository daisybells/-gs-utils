import fs from "node:fs/promises";
async function getRecursiveFileCall(directory) {
    const firstCall = {
        filepath: directory,
        isDirectory: true,
    };
    try {
        firstCall.isDirectory = (await fs.stat(directory)).isDirectory();
    }
    catch (error) {
        throw new Error(`Filepath '${directory}' does not exist.`, {
            cause: error,
        });
    }
    return firstCall;
}
export { getRecursiveFileCall };
