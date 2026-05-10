import fs from "node:fs/promises";
import path from "node:path";
import { getRecursiveFileCall } from "./helpers/get-recursive-call.js";
async function searchFilesRecursive(directory, options) {
    const { includeDirectories, filter, asRoot, fullPath, } = {
        fullPath: false,
        filter: () => true,
        includeDirectories: false,
        asRoot: false,
        ...(options || {}),
    };
    const callStack = [
        await getRecursiveFileCall(directory),
    ];
    const files = [];
    const pushFile = async (filepath) => {
        if (filepath === directory) {
            return;
        }
        const relativePath = path.relative(directory, filepath);
        const isIncluded = await filter(relativePath);
        if (!isIncluded) {
            return;
        }
        const outputPath = getFilepath(relativePath);
        if (isIncluded) {
            files.push(outputPath);
        }
    };
    while (callStack.length > 0) {
        const frame = callStack.pop();
        if (!frame) {
            throw new Error("Impossible state.");
        }
        const currentFile = frame.filepath;
        if (!frame.isDirectory) {
            await pushFile(currentFile);
            continue;
        }
        if (includeDirectories) {
            await pushFile(currentFile);
        }
        const entries = await fs.readdir(currentFile, {
            withFileTypes: true,
        });
        for (const entry of entries.toReversed()) {
            const currentPath = path.join(currentFile, entry.name);
            callStack.push({
                filepath: currentPath,
                isDirectory: entry.isDirectory(),
            });
        }
    }
    return files;
    function getFilepath(directoryFile) {
        if (fullPath) {
            return path.resolve(directory, directoryFile);
        }
        if (asRoot) {
            return path.join("/", directoryFile);
        }
        return directoryFile;
    }
}
export { searchFilesRecursive };
