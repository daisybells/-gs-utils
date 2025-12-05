import fs from "node:fs/promises";
import path from "node:path";

const HIDDEN_FILES_SET = new Set([".DS_Store", "Desktop.ini"]);

const defaultOptions = {
    deleteHiddenFiles: true,
    filter: null,
    maxDepth: 0,
};

/**
 * Filter to ignore specific directories when doing the directory clear.
 * @callback FileFilter
 * @param {String} filepath - Current filepath.
 * @returns {Boolean} - Process file (true) or skip file (false).
 */

/**
 * @typedef {Object} CleanEmptyOptions
 * @property {Boolean} [inputOptions.deleteHiddenFiles = false] - Chooses whether to include
 * hidden files such as ".DS_Store" when determining if a directory is empty.
 * @property {FileFilter} [inputOptions.filter = null] - Filter out directories to ignore while processing.
 * @property {number} [inputOptions.maxDepth = 0] - Maximum allowed depth of recursion. Default (0) means
 * no limit.
 *
 */

/**
 * Recursively deletes all empty folders from a given directory.
 * @param {String} directory - Directory to clean.
 * @param {CleanEmptyOptions} [inputOptions] - Configurable options.

 * @returns {Promise<void>}
 */
async function cleanEmptyFolders(directory, inputOptions = {}) {
    await cleanEmptyFoldersHandler(directory, inputOptions);
}
/**
 *
 * @param {String} directory
 * @param {CleanEmptyOptions} [inputOptions]
 * @returns {Promise<Boolean>}
 */
async function cleanEmptyFoldersHandler(
    directory,
    inputOptions = {},
    depth = 0
) {
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
        if (isDeleted) return null;
        return file;
    });

    const remainingFiles = (await Promise.all(removePromises)).filter(Boolean);

    const workingFiles = deleteHiddenFiles
        ? remainingFiles.filter((file) => {
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
