import fs from "node:fs/promises";
import path from "node:path";

import type { Dirent } from "node:fs";
import type { CleanEmptyFoldersOptions } from "@/types/fs.js";

const HIDDEN_FILES_SET: Set<string> = new Set([".DS_Store", "Desktop.ini"]);

/**
 * Remove empty folders from a given directory.
 * @param directory
 * @param options
 */
async function cleanEmptyFolders(
    directory: string,
    options?: Partial<CleanEmptyFoldersOptions>,
): Promise<void> {
    const cleanEmptyOptions: CleanEmptyFoldersOptions = {
        deleteHiddenFiles: true,
        filter: null,
        maxDepth: 0,
        ...(options || {}),
    };
    await cleanEmptyFoldersHandler(directory, cleanEmptyOptions);
}
async function cleanEmptyFoldersHandler(
    directory: string,
    options: CleanEmptyFoldersOptions,
    depth: number = 0,
) {
    const { deleteHiddenFiles, filter, maxDepth }: CleanEmptyFoldersOptions =
        options;
    if (maxDepth > 0 && depth > maxDepth) {
        console.log(`rmdir: '${directory}' skipped -> Max depth reached.`);
        return false;
    }

    const isIncluded: boolean =
        typeof filter === "function" ? await filter(directory) : true;

    if (depth > 0 && !isIncluded) {
        return false;
    }

    const entries: Dirent<string>[] = await fs.readdir(directory, {
        withFileTypes: true,
    });

    const removePromises: Promise<Dirent<string> | null>[] = entries.map(
        async (file: Dirent<string>) => {
            const fullPath: string = path.join(directory, file.name);
            if (!file.isDirectory()) {
                return file;
            }

            const isDeleted: boolean = await cleanEmptyFoldersHandler(
                fullPath,
                options,
                depth + 1,
            );
            if (isDeleted) {
                return null;
            }
            return file;
        },
    );

    const remainingFiles: Dirent<string>[] = (
        await Promise.all(removePromises)
    ).filter((file): file is Dirent<string> => {
        return Boolean(file);
    });

    const workingFiles: Dirent<string>[] = deleteHiddenFiles
        ? remainingFiles.filter((file) => {
              return !HIDDEN_FILES_SET.has(file.name);
          })
        : remainingFiles;

    if (workingFiles.length > 0 || depth === 0) {
        return false;
    }

    await Promise.all(
        workingFiles.map(async (file) => {
            if (!file) {
                return;
            }
            const fullPath = path.join(directory, file.name);
            await fs.rm(fullPath);
        }),
    );
    console.log(`rmdir: ${directory}`);

    await fs.rmdir(directory);
    return true;
}

export { cleanEmptyFolders };
