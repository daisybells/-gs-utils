import fs from "node:fs/promises";
import path from "node:path";
import { mapFilter } from "../misc/object/map-filter.js";

/**
 * Callback function that takes an input base path and filters it.
 * @callback fileFilter
 * @param {import("node:fs").PathLike} - Base filepath without the full path appended.
 * @returns {Boolean}
 **/

/**
 * Asynchronously return all filepaths within an input directory.
 * @param {import("node:fs").PathLike} directory - Input directory to search
 * @param {Object} inputOptions - Configurable options for plugin.
 *
 * @param {Boolean} [inputOptions.fullPath = false] - Determines whether or not to
 * return full filepath
 * @param {fileFilter} [inputOptions.filter] - Function that determines how to filter
 * files.
 * @param {Boolean} [inputOptions.includeDirectories = false] - Determines whether or not
 * to include directories in search
 * @param {Boolean} [inputOptions.asRoot = false] - Determines if the input directory
 * should be treated as a root directory.
 *
 * @returns {Promise<Array>} - All files and paths within directory.
 */
async function searchFilesRecursive(directory, inputOptions = {}) {
    return await searchFilesRecursiveHandler(directory, inputOptions);
}
async function searchFilesRecursiveHandler(
    directory,
    inputOptions = {},
    base = directory
) {
    const defaultOptions = {
        fullPath: false,
        filter: null,
        includeDirectories: false,
        asRoot: false,
    };
    const options = { ...defaultOptions, ...inputOptions };

    const { filter, includeDirectories } = options;

    const entries = await fs.readdir(directory, { withFileTypes: true });
    const filePromises = entries.map(async (entry) => {
        const fullPath = path.join(directory, entry.name);
        const relativePath = path.relative(base, fullPath);
        if (!entry.isDirectory()) return relativePath;

        const nextEntry = await searchFilesRecursiveHandler(
            fullPath,
            options,
            base
        );

        return includeDirectories ? [relativePath, ...nextEntry] : nextEntry;
    });
    const allFiles = (await Promise.all(filePromises)).flat();
    return mapFilter(allFiles, (filePath) => {
        const outputPath = makeFilePath(filePath, options, base);

        if (!filter || typeof filter !== "function") {
            return outputPath;
        }
        const isIncluded = filter(outputPath);

        if (!isIncluded) return null;

        return outputPath;
    });
}

function makeFilePath(filePath, options, base = "") {
    const { asRoot, fullPath } = options;

    switch (true) {
        case fullPath:
            return path.resolve(base, filePath);
        case asRoot:
            return path.join("/", filePath);
        default:
            return filePath;
    }
}

export { searchFilesRecursive };
