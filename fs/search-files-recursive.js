import fs from "node:fs/promises";
import path from "node:path";

/**
 * A string representing a filesystem Path.
 * @typedef {string} PathLike
 */

/**
 * Callback function that takes an input base path and filters it.
 * (DOES NOT USE FULL PATH)
 * @callback fileFilter
 * @param {PathLike} - Base filepath without the full path appended.
 * @returns {Boolean}
 **/

/**
 * Asynchronously return all filepaths within an input directory.
 * @param {PathLike} directory - Input directory to search
 * @param {Object} inputOptions - Configurable options for plugin.
 *
 * @param {Boolean} [inputOptions.fullPath = false] - Determines whether or not to
 * return full filepath
 * @param {fileFilter} [inputOptions.filter] - function that determines how to filter
 * files.
 * @param {Boolean} [inputOptions.includeDirectories = false] - Determines whether or not
 * to include directories in search
 *
 * @param {PathLike} base - Dummy input that remains equal to original input directory
 * throughout recursive search.
 * @returns {Promise<Array>} - All files and paths within directory.
 */
async function searchFilesRecursive(
    directory,
    inputOptions = {},
    base = directory
) {
    const defaultOptions = {
        fullPath: false,
        filter: null,
        includeDirectories: false,
    };
    const options = { ...defaultOptions, ...inputOptions };

    const { fullPath: fullPathBoolean, filter, includeDirectories } = options;

    const entries = await fs.readdir(directory, { withFileTypes: true });
    const files = await Promise.all(
        entries.map(async (entry) => {
            const fullPath = path.join(directory, entry.name);
            const relative = path.relative(base, fullPath);
            if (!entry.isDirectory()) return relative;
            const nextEntry = await searchFilesRecursive(
                fullPath,
                options,
                base
            );

            return includeDirectories ? [relative, ...nextEntry] : nextEntry;
        })
    );
    const allFiles = files.flat();
    const filteredFiles =
        typeof options.filter === "function"
            ? allFiles.filter(filter)
            : allFiles;
    if (fullPathBoolean)
        return filteredFiles.map((filePath) => path.resolve(base, filePath));

    return filteredFiles;
}
export { searchFilesRecursive };
