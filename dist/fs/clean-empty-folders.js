import fs from "node:fs/promises";
import path from "node:path";
const HIDDEN_FILES_SET = new Set([".DS_Store", "Desktop.ini"]);
/**
 * Remove empty folders from a given directory.
 * @param directory
 * @param options
 */
async function cleanEmptyFolders(directory, options) {
    const cleanEmptyOptions = {
        deleteHiddenFiles: true,
        filter: null,
        maxDepth: 0,
        ...(options || {}),
    };
    await cleanEmptyFoldersHandler(directory, cleanEmptyOptions);
}
async function cleanEmptyFoldersHandler(directory, options, depth = 0) {
    const { deleteHiddenFiles, filter, maxDepth } = options;
    if (maxDepth > 0 && depth > maxDepth) {
        console.log(`rmdir: '${directory}' skipped -> Max depth reached.`);
        return false;
    }
    const isIncluded = typeof filter === "function" ? await filter(directory) : true;
    if (depth > 0 && !isIncluded) {
        return false;
    }
    const entries = await fs.readdir(directory, {
        withFileTypes: true,
    });
    const removePromises = entries.map(async (file) => {
        const fullPath = path.join(directory, file.name);
        if (!file.isDirectory()) {
            return file;
        }
        const isDeleted = await cleanEmptyFoldersHandler(fullPath, options, depth + 1);
        if (isDeleted) {
            return null;
        }
        return file;
    });
    const remainingFiles = (await Promise.all(removePromises)).filter((file) => {
        return Boolean(file);
    });
    const workingFiles = deleteHiddenFiles
        ? remainingFiles.filter((file) => {
            return !HIDDEN_FILES_SET.has(file.name);
        })
        : remainingFiles;
    if (workingFiles.length > 0 || depth === 0) {
        return false;
    }
    await Promise.all(workingFiles.map(async (file) => {
        if (!file) {
            return;
        }
        const fullPath = path.join(directory, file.name);
        await fs.rm(fullPath);
    }));
    console.log(`rmdir: ${directory}`);
    await fs.rmdir(directory);
    return true;
}
export { cleanEmptyFolders };
//# sourceMappingURL=clean-empty-folders.js.map