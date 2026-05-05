import fs from "node:fs/promises";

import type { RecursiveFileFrame } from "@/types/fs.js";

async function getRecursiveFileCall(
    directory: string,
): Promise<RecursiveFileFrame> {
    const firstCall: RecursiveFileFrame = {
        filepath: directory,
        isDirectory: true,
    };
    try {
        firstCall.isDirectory = (await fs.stat(directory)).isDirectory();
    } catch (error) {
        throw new Error(`Filepath '${directory}' does not exist.`, {
            cause: error,
        });
    }
    return firstCall;
}

export { getRecursiveFileCall };
