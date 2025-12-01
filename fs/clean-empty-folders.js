import fs from "node:fs/promises";
import path from "node:path";

const HIDDEN_FILES_SET = new Set([".DS_Store", "Desktop.ini"]);

/**
 * Filter to ignore specific directories when doing the directory clear.
 * @callback fileFilter
 * @param {import("node:fs").PathLike} - Current filepath.
 * @returns {Boolean} - Process file (true) or skip file (false).
 */

/**
 * Recursively deletes all empty folders from a given directory.
 * @param {import("node:fs").PathLike} directory - Directory to clean.
 * @param {object} [inputOptions] - Configurable options.
 * @param {Boolean} [inputOptions.deleteHiddenFiles = false] - Chooses whether to include
 * hidden files such as ".DS_Store" when determining if a directory is empty.
 * @param {fileFilter} [inputOptions.filter = null] - Filter out directories to ignore while processing.
 * @param {number} [inputOptions.maxDepth = 0] - Maximum allowed depth of recursion. Default (0) means
 * no limit.
 * @returns {Promise<void>}
 */
async function cleanEmptyFolders(directory, inputOptions = {}) {
    await cleanEmptyFoldersHandler(directory, inputOptions);
}
async function cleanEmptyFoldersHandler(
    directory,
    inputOptions = {},
    depth = 0
) {
    const defaultOptions = {
        deleteHiddenFiles: true,
        filter: null,
        maxDepth: 0,
    };
    const options = { ...defaultOptions, ...inputOptions };

    const { deleteHiddenFiles, filter, maxDepth } = options;
    if (maxDepth > 0 && depth > maxDepth) {
        console.log(`rmdir: '${directory}' skipped -> Max depth reached.`);
        return false;
    }

    const isIncluded = typeof filter === "function" ? filter(directory) : true;

    if (depth > 0 && !isIncluded) {
        return false;
    }

    const entries = await fs.readdir(directory, { withFileTypes: true });

    const removePromises = entries.map(async (file) => {
        const fullPath = path.join(directory, file.name);
        if (!file.isDirectory()) return file;

        const isDeleted = await cleanEmptyFoldersHandler(
            fullPath,
            options,
            depth + 1
        );
        return !isDeleted;
    });
    const remainingFiles = (await Promise.all(removePromises)).filter(Boolean);

    const workingFiles = deleteHiddenFiles
        ? remainingFiles.filter((file) => {
              if (file === true) return true;
              return !HIDDEN_FILES_SET.has(file.name);
          })
        : remainingFiles;

    if (workingFiles.length > 0 || depth === 0) {
        return false;
    }

    await Promise.all(
        remainingFiles.map(async (file) => {
            const fullPath = path.join(directory, file.name);
            await fs.rm(fullPath);
        })
    );
    console.log(`rmdir: ${directory}`);

    await fs.rmdir(directory);
    return true;
}

export { cleanEmptyFolders };
