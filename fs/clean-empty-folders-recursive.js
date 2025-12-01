import fs from "node:fs/promises";
import path from "node:path";
import { mapFilter } from "../misc/object/map-filter.js";

const HIDDEN_FILES_SET = new Set([".DS_Store", "Desktop.ini"]);

async function cleanEmptyFolders(directory, inputOptions = {}) {
    return await cleanEmptyFoldersHandler(directory, inputOptions);
}
async function cleanEmptyFoldersHandler(directory, inputOptions = {}) {
    const defaultOptions = {
        includeHiddenFiles: false,
    };
    const options = { ...defaultOptions, ...inputOptions };

    const { includeDsStore } = options;

    const entries = await fs.readdir(directory, { withFileTypes: true });
    const workingEntries = includeDsStore
        ? entries.filter((file) => HIDDEN_FILES_SET.has(file.name))
        : entries;

    const removePromises = workingEntries.map(async (file) => {
        const fullPath = path.join(directory, file.name);
        if (!file.isDirectory()) return file;

        await cleanEmptyFoldersHandler(fullPath, options);
        return null;
    });
    const removedFiles = (await Promise.all(removePromises)).filter(Boolean);
    if (removedFiles.length > 0) {
        return;
    }

    await Promise.all(
        entries.map(async (file) => {
            const fullPath = path.join(directory, file.name);
            await fs.rm(fullPath);
        })
    );
    await fs.rmdir(directory);
}

export { cleanEmptyFolders };
